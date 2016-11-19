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
				close: 'assessresultClose', // 并且发送微信消息
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
				width: 300,height: 380,
				scrollable: true,
				hidden: true,
				layout: 'fit',
				
				//parentRecord: record, //传递父窗口参数：当前学生记录
				
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
				        { title: '数学•初一上', subjectID:1,gradeID:7,semester:'上' },
				        { title: '数学•初一下', subjectID:1,gradeID:7,semester:'下' },
				        { title: '数学•初二上', subjectID:1,gradeID:8,semester:'上' },
				        { title: '数学•初二下', subjectID:1,gradeID:8,semester:'下' },
				        { title: '数学•初三上', subjectID:1,gradeID:9,semester:'上' },
				        { title: '数学•初三下', subjectID:1,gradeID:9,semester:'下' },
				        { title: '物理•初二上', subjectID:2,gradeID:8,semester:'上' },
				        { title: '物理•初二下', subjectID:2,gradeID:8,semester:'下' },
				        { title: '物理•初三上', subjectID:2,gradeID:9,semester:'上' },
				        { title: '物理•初三下', subjectID:2,gradeID:9,semester:'下' },
				        { title: '化学•初三上', subjectID:3,gradeID:9,semester:'上' },
				        { title: '化学•初三下', subjectID:3,gradeID:9,semester:'下' },
				    ],
				}],	
				
				listeners: [{
					delegate: 'list',
					event: 'itemtap',
					fn: function( list, index, target, modalRecord, e, eOpts ){ 
						console.log('subject list itemtap')
						// 显示对应科目的测评题目
						//var modal = list.up('panel')
						console.log(modalRecord)
						
						this.destroy() 
						
						showAssessTopic(modalRecord)
					}
				}]
			})
			overlay.show()
			
			// 测评试卷
			function showAssessTopic(modalRecord){
				Ext.Viewport.setMasked({xtype:'loadmask',message:'正在出题'});
				var params = {
					"subjectID": modalRecord.data.subjectID,
					"gradeID"  : modalRecord.data.gradeID, 
					"semester" : modalRecord.data.semester,
				}		
				var store = Ext.getStore('Topic'); 
				store.removeAll()
				//store.clearFilter() 
				store.getProxy().setUrl(me.getApplication().dataUrl + 
					'readAssessTopic.php?data=' + JSON.stringify(params));
				store.load({
					callback: function(records, operation, success){
					    Ext.Viewport.setMasked(false)
						if (success){
							console.log(records)
							me.assesstopic = Ext.create('Youngshine.view.student.assess.AssessTopic');
							me.assesstopic.setParentRecord(record); //传递参数：学生
							
							me.assesstopic.setParentSubject(params); //传递参数，测评学科
							Ext.Viewport.add(me.assesstopic);
							Ext.Viewport.setActiveItem(me.assesstopic);
						
							me.assesstopic.down('label[itemId=assessSubject]').setHtml(modalRecord.data.title)
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
			width: 550, height:550,
			scrollable: true,
			//layout: 'vbox',
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
			},{
				xtype: 'panel',
				html: record.data.content,
				itemId: 'topicContent',
				styleHtmlContent: true	
			}],	
		})
		this.overlay.show()
		//this.overlay.down()
	},
	
	// 提交测评试卷，生成报告，并转换成html保存到cos+数据表
	assesstopicSave: function(subject,studentRecord,objSubject){		
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
					//"subject": subject,
				})
			}else{ //重复的，累加题目数
				Ext.Array.each(arrZsd, function(rec,index) {
			        if(arrZsd[index].name === record.data.zsdName){
			        	arrZsd[index].value1 += answer ? 1:0, // 做对的题目
						arrZsd[index].value2 += 1
						return false; // break here
			        }
			    });
			}
		});
		console.log(arrZsd)

		me.assessresult = Ext.create('Youngshine.view.student.assess.AssessResult');
		me.assessresult.setParentRecord(studentRecord); //传递数:student
		
		me.assessresult.setParentSubject(objSubject); //传递参数，测评学科
		
		me.assessresult.down('label[itemId=assessSubject]').setHtml(subject)
		//me.assessresult.down('chart').setStore(storeChart) // 图表
		me.assessresult.down('chart').getStore().setData(arrZsd) // 图表
		Ext.Viewport.add(me.assessresult);
		Ext.Viewport.setActiveItem(me.assessresult);
		
		me.assessresult.down('panel[itemId=topicList]').setData(data);
		me.assessresult.down('panel[itemId=zsdList]').setData(arrZsd);
		/*
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
		tpl.overwrite(me.assessresult.down('panel[itemId=topicList]').body, data); 
		
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
		tplZsd.overwrite(me.assessresult.down('panel[itemId=zsdList]').body, arrZsd); 
		*/
		
		// 传递参数
		var result = arrZsd //JSON.stringify(arrZsd)
	
		var objAssess = {
			"time"       : new Date().getTime(),
			"studentID"  : studentRecord.data.studentID,
			"studentName": studentRecord.data.studentName,
			"wxID"       : studentRecord.data.wxID,
			"schoolsub"  : studentRecord.data.schoolsub,
			"subject"    : subject,
			"result"     : result,		
		}
		console.log(objAssess)
		console.log(JSON.stringify(objAssess))
		
		me.assessresult.setParentRecord(objAssess)
		//return
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在生成报告'});
		// 最新的一份测评报告，保存到数据库学生记录中assessReport字段
		Ext.data.JsonP.request({
            url: me.getApplication().dataUrl + 'updateStudentByAssess.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(objAssess)
            },
            success: function(result){
				console.log(result)
				Ext.Viewport.setMasked(false)
				if(result.success){
					
				}	
				//Ext.toast(result.message,3000)
			},
        });
	},
	
	// 关闭，保存到数据记录，并推送微信消息给家长
	assessresultClose: function(obj,oldView){		
		var me = this; console.log(obj)
		//oldView.destroy()	
		Ext.Viewport.remove(me.assessresult,true); //remove/destroy 当前界面
		Ext.Viewport.setActiveItem(me.student);
		
		Ext.toast('微信消息推送成功',2000)
		
		// 发送模版消息：电子收据
		wxTpl(obj); 

		function wxTpl(objWx){
			console.log(objWx)
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl+'weixinJS_gongzhonghao/wx_msg_tpl_assess.php',
			    params: objWx,
			    success: function(response){
			        var text = response.responseText;
			        // process server response here
					console.log(text)//JSON.parse
					//Ext.toast('微信消息推送成功')
			    }
			});
		} // 模版消息end
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
	
	studentAddnew: function(){		
		var me = this; console.log('new')
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
					//oldView.destroy()
					Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
					Ext.Viewport.setActiveItem(me.student);
					obj.studentID = result.data.studentID; //最新插入的id，删除用
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
