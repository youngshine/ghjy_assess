// 学生相关的控制器，
Ext.define('Youngshine.controller.Student', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	student: 'student',
			studentaddnew: 'student-addnew',
			//studentedit: 'student-edit',
			studentshow: 'student-show',
			assesstopic: 'assess-topic',
			assessresult: 'assess-result',
        },
        control: {
			student: {
				addnew: 'studentAddnew', //itemtap
				itemtap: 'studentItemtap', //包含：修改
			},
			assesstopic: {
				back: 'assesstopicBack',
				save: 'assesstopicSave', //生成并导出html文件，保存腾讯云cos+数据表
				itemtap: 'assesstopicItemtap',
			},
			'assess-result': {
				close: 'assessresultClose',
				//save: 'assessresultSave', //导出html文件，保存腾讯云cos+数据表
				zsdhist: 'assessresultZsdhist',
			},
			studentaddnew: {
				save: 'studentaddnewSave', 
				cancel: 'studentaddnewCancel'
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	showStudent: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'student') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.student = Ext.create('Youngshine.view.student.List');
		Ext.Viewport.add(me.student);
		Ext.Viewport.setActiveItem(me.student);		 
	},

	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; console.log(e)
	
		if(e.target.className == 'qrcode'){
			var overlay = Ext.Viewport.add({
				xtype: 'panel',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 450,height: 480,
				scrollable: true,
				hidden: true,
		        items: [{	
		        	xtype: 'toolbar',
		        	docked: 'top',
		        	title: '一键扫码绑定微信',
					ui: 'light'
				},{
					xtype: 'component',
					html: ''
				}],	
			})
			//this.overlay.show()
			Ext.Ajax.request({
			    url: 'script/weixinJS_gongzhonghao/wx_qrcode.php',
			    params: {
					studentID: record.data.studentID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					console.log(ret)
					overlay.show()
				
					//overlay.down('image').setSrc(ret.img)  
					var img = '<img src=' + ret.img + ' />'
					overlay.setHtml(img) 
					overlay.down('toolbar').setTitle(record.data.studentName+'｜'+record.data.phone)
			    }
			});	
		}
		
		if(e.target.className == 'assess'){
			var overlay = Ext.Viewport.add({
				xtype: 'panel',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 300,height: 480,
				scrollable: true,
				hidden: true,
				layout: 'fit',
				
				parentRecord: record, //传递父窗口参数：当前学生记录
				
		        items: [{	
		        	xtype: 'toolbar',
		        	docked: 'top',
		        	title: '选择测评学科',
					ui: 'light'
				},{
					xtype: 'list',
					//disableSelection: true,
				    itemTpl: '{title}',
				    data: [
				        { title: '数学•初一上' },
				        { title: '数学•初一下' },
				        { title: '数学•初二上' },
				        { title: '数学•初二下' },
				        { title: '数学•初三上' },
				        { title: '数学•初三下' },
				    ],
				}],	
				
				listeners: [{
					delegate: 'list',
					event: 'itemtap',
					fn: function( list, index, target, record, e, eOpts ){ 
						console.log('subject list itemtap')
						// 显示对应科目的测评题目
						var modal = list.up('panel')
						console.log(modal.parentRecord.data)
						me.assesstopic = Ext.create('Youngshine.view.student.assess.AssessTopic');
						me.assesstopic.down('label[itemId=assess-subject]').setHtml(record.data.title)
						me.assesstopic.setParentRecord(modal.parentRecord); //传递数
						Ext.Viewport.add(me.assesstopic);
						Ext.Viewport.setActiveItem(me.assesstopic);
						
						this.destroy() 
						
						showAssessTopic(record)
					}
				}]
			})
			overlay.show()
			
			// 测评试卷
			function showAssessTopic(){
				// 某个学校的分校区1-n个，表先加载进来，添加修改用
				var obj = {
					"subjectID": 3,
					"gradeID": 9, //semester'初一上',
				}		
				var store = Ext.getStore('Topic'); 
				store.removeAll()
				//store.clearFilter() 
				store.getProxy().setUrl(me.getApplication().dataUrl + 
					'readAssessTopic.php?data=' + JSON.stringify(obj));
				store.load({
					callback: function(records, operation, success){
					    if (success){
							console.log(records)
							return;
							
							var data = []
							Ext.Array.each(records, function(record, index, countriesItSelf) {
								data.push({
									gid: record.data.gid,
									content: record.data.content,
									objective_answer: record.data.objective_answer,
									//gidNo: index+1,
								})
							});
							console.log(data)
							var tpl = new Ext.XTemplate(
							    '<tpl for=".">',     // interrogate the kids property within the data
							        '<p style="color:blue;">题目：{#}</p>',
									'<p>{content}</p>',
									'<br><br>',
							    '</tpl>'
							);
							tpl.overwrite(me.assess.down('panel[itemId=topicInfo]').body, data); 
						};
					} 
				})
			}
		}
	},
	
	assesstopicBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		Ext.Viewport.remove(me.assesstopic,true); //remove/destroy 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},

	// 测评答题
	assesstopicItemtap: function(list,index,item,record){
		var me = this; 
		this.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: 420, height: 120,
			//scrollable: true,
			layout: 'vbox',
	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
				ui: 'light',
	        	title: '答题卡',
			},{
			    xtype: 'fieldset',
				layout: 'hbox',
				items: [{
		            xtype: 'radiofield',
		            name : 'answer',
		            value: 'A',
		            label: 'A',
		            //checked: true
		        },{
		            xtype: 'radiofield',
		            name : 'answer',
		            value: 'B',
		            label: 'B'
		        },{
		            xtype: 'radiofield',
		            name : 'answer',
		            value: 'C',
		            label: 'C'
		        },{
		            xtype: 'radiofield',
		            name : 'answer',
		            value: 'D',
		            label: 'D'
		        }],
				
				listeners: [{
					delegate: 'radiofield',
					event: 'check',
					fn: function(radio){
						//var val = radio.getValue(),fullDone = radio.getLabel()
						record.set('myAnswer',radio.getValue())
						me.overlay.destroy()
					}
				}]	
			}],	
		})
		this.overlay.show()
	},
	
	// 提交测评试卷，生成报告，并转换成html保存到cos+数据表
	assesstopicSave: function(subject,oldView){		
		var me = this; 
		
		var store = Ext.getStore('Topic'); 
		var data = [],arrZsd = [],zsdName = ''
		store.each(function(record){
			// 题目做对做错？
			var answer = (record.data.myAnswer == record.data.objective_answer)
			
			data.push({
				gid: record.data.gid,
				content: record.data.content,
				objective_answer: record.data.objective_answer,
				myAnswer: record.data.myAnswer,
				//gidNo: index+1,
				zsdName: record.data.zsdName,
				"value1": answer ? 1:0, // 做对的题目
				"value2": 1,
			})
			
			// 重复的累加
			if(record.data.zsdName != zsdName){
				zsdName = record.data.zsdName
				arrZsd.push({
					"name": zsdName,
					"value1": answer ? 1:0, // 做对的题目
					"value2": 1,
					"subject": subject,
				})
			}else{ //重复的，累加题目数
				Ext.Array.each(arrZsd, function(rec,index) {
			        if(arrZsd[index].name === record.data.zsdName){
			        	arrZsd[index].value1 += answer ? 1:0, // 做对的题目
						arrZsd[index].value2 += 1
			        }
			    });
			}
		});
		console.log(arrZsd)

		me.assessresult = Ext.create('Youngshine.view.student.assess.AssessResult');
		me.assessresult.down('label[itemId=assess-title]')
			.setHtml(oldView.getParentRecord().data.studentName + '｜' + subject)
		//me.assessresult.down('chart').setStore(storeChart) // 图表
		me.assessresult.down('chart').getStore().setData(arrZsd) // 图表
		Ext.Viewport.add(me.assessresult);
		Ext.Viewport.setActiveItem(me.assessresult);
		
		var tpl = new Ext.XTemplate(
		    '<tpl for=".">',     // interrogate the kids property within the data
				'<p>题目{#}：',
				'<tpl if="myAnswer == objective_answer">',
		            '<span style="color:green;">✔</span>',
				'<tpl else>',
					'<span style="color:red;">✘</span>',
		        '</tpl>',
				'<span style="float:right;">{myAnswer}／{objective_answer}</p>',
				'<p style="color:#888;font-size:0.8em;">知识点：{zsdName}</p>',
		    '</tpl>'
		);
		tpl.overwrite(me.assessresult.down('panel[itemId=topic-list]').body, data); 
		
		var tplZsd = new Ext.XTemplate(
		    '<tpl for=".">',     // interrogate the kids property within the data
				'<p>{name}<span style="float:right;color:#888;">{#}</span></p>',
				'<tpl if="value1 == value2">',
		            '<p style="color:green;">Good Job。继续保持</p>',
				'<tpl else>',
					'<p style="color:red;">加强学习，最好来补习。</p>',
		        '</tpl>',
				'<br>',
		    '</tpl>'
		);
		tplZsd.overwrite(me.assessresult.down('panel[itemId=zsd-list]').body, arrZsd); 
		
		// 传递参数
		me.assessresult.setParentRecord({
			"studentID": oldView.getParentRecord().data.studentID,
			//"subject"  : subject,
			"result"   : arrZsd,
		})
		
		return
		
		// 最新的一份测评报告
		Ext.data.JsonP.request({
            url: me.getApplication().dataUrl + 'updateStudentByAssess.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result)
				if(result.success){
					obj.studentfollowID = result.data.studentfollowID; 
					obj.created = '刚刚'
					Ext.getStore('Followup').insert(0,obj)
				}	
				Ext.toast(result.message,3000)
			},
        });
	},
	
	// 关闭，保存到数据记录，并推送微信消息给家长
	assessresultClose: function(oldView){		
		var me = this;
		//oldView.destroy()	
		Ext.Viewport.remove(me.assessresult,true); //remove/destroy 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},
	
	// 历年考点雷达图
	assessresultZsdhist: function(obj)	{
    	var me = this; console.log(obj)
		
		me.zsdhist = Ext.create('Youngshine.view.student.assess.PolarChart');
		Ext.Viewport.add(me.zsdhist); //否则build后无法显示
		
		var store = Ext.getStore('Zsdhist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAssessZsdhist.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
				if (success){
					//Ext.Viewport.setActiveItem(me.assesshist);
					me.zsdhist.show(); // overlay show
				};
			}   		
		});	
	},
	
	studentAddnew: function(win){		
		var me = this;
		me.studentaddnew = Ext.create('Youngshine.view.student.Addnew');
		Ext.Viewport.add(me.studentaddnew);
		Ext.Viewport.setActiveItem(me.studentaddnew)
	},
	
	// 取消添加
	studentaddnewCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},	
	
	studentaddnewSave: function( obj,oldView )	{
    	var me = this; 
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createStudent.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
				Ext.toast(result.message,3000)
				if(result.success){
					//var text = response.responseText; JSON.parse()
					//oldView.destroy()
					Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
					Ext.Viewport.setActiveItem(me.student);
					obj.studentID = result.data.studentID; //删除用
					//obj.created = new Date();
					Ext.getStore('Student').insert(0,obj)
				}
		    }
		});
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('student controller init');
	}
});
