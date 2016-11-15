// 测评相关控制器，报名前
Ext.define('Youngshine.controller.Assess', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	assess: 'assess',
			assessaddnew: 'assess-addnew',
			student: 'assess-student',
			assesstopic: 'assess-topic',
			topicshow: 'topic-show',
			zsd: 'topic-zsd'
        },
        control: {
			assess: {
				addnew: 'assessAddnew',
				itemtap: 'assessItemtap', //包括'排课‘’
				itemswipe: 'assessItemswipe' //delete
			},
			assessaddnew: {
				save: 'assessaddnewSave',
				cancel: 'assessaddnewCancel',
				student: 'assessaddnewStudent', //查找选择学生 
			},
			student: {
				//search: '', //itemtap
				itemtap: 'studentItemtap'
			},
			'assess-topic': {
				back: 'assesstopicBack',
				addnew: 'assesstopicAddnew',
				//save: '',
				hist: 'assesstopicHist', //历年考点雷达图
				report: 'assesstopicReport', //报告
				itemtap: 'assesstopicItemtap', //答案及评分
				itemswipe: 'assesstopicItemswipe' //delete
			},
			'topic-zsd': { //zsd
				choose: 'zsdChoose' // itemtap
			}
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	assessList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'assess') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.assess = Ext.create('Youngshine.view.assess.List');
		Ext.Viewport.add(me.assess);
		Ext.Viewport.setActiveItem(me.assess);
		//view.onGenreChange(); //默认
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"teacherID"  : 0
		}		
		var store = Ext.getStore('Assess');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAssessList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    if (success){
					
				};
			} 
		})	  			 
	},

	assessItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		//if(e.target.className == 'kcb'){
			me.assesstopic = Ext.create('Youngshine.view.assess.Topic');
			//Ext.Viewport.add(me.assesstopic); //否则build后无法显示
			//me.studykcb.show()
			me.assesstopic.setParentRecord(record)
			var subject = record.data.subjectName + '｜' + record.data.gradeName + record.data.semester
			me.assesstopic.down('toolbar').setTitle('测评：'+subject)
		//}	
		
		// 获取当前测评记录
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取课时记录'});
		var obj = {
			"assessID": record.data.assessID,
			"subjectID": record.data.subjectID, //题目按学科分3个表
		};
		console.log(obj)
		var store = Ext.getStore('Topic'); 
		store.removeAll();
		store.clearFilter()
        var url = this.getApplication().dataUrl + 
			'readTopicList.php?data=' + JSON.stringify(obj);
		store.getProxy().setUrl(url);
        store.load({
			callback: function(records, operation, success){
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.add(me.assesstopic) // build?
					Ext.Viewport.setActiveItem(me.assesstopic);
				}else{
					Ext.toast(result.message,3000);
				};
			} 
        }); 
	},	
	// 向左滑动，删除
	assessItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(list)
		var me = this;
		/* swipe right to pop menu
		if(e.direction == 'right'){ 
			me.getApplication().getController('Main').menuNav()
			return 
		}  */
		if(e.direction != 'left') return
		// left to delete
		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					del(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteAssess.php',
			    params: {
					assessID: rec.data.assessID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Assess').remove(rec);
					}		         
			    }
			});
		}
	},	
	
	assessAddnew: function(win){		
		var me = this;
		//if(!me.assessaddnew){
			me.assessaddnew = Ext.create('Youngshine.view.assess.Addnew');
			Ext.Viewport.add(me.assessaddnew)
		//}
		Ext.Viewport.setActiveItem(me.assessaddnew)
	},
	// 取消添加
	assessaddnewCancel: function(oldView){		
		var me = this;
		Ext.Viewport.remove(me.assessaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.assess);
	},	
	assessaddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createAssess.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				//oldView.destroy()
				Ext.Viewport.remove(me.assessaddnew,true); //remove 当前界面
				Ext.Viewport.setActiveItem(me.assess);
				obj.assessID = result.data.assessID
				obj.created = '刚刚';
				Ext.getStore('Assess').insert(0,obj)
		    }
		});
	},
	// 查找选择的学生
	assessaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.assess.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示

		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					//Ext.Viewport.setActiveItem(me.student);
					me.student.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.assessaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName+'［'+record.data.grade+'］')
		me.assessaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
	},
	
	// 返回
	assesstopicBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		console.log(me.assess)	
		//Ext.Viewport.remove(me.teachercourse); //remove 当前界面
		Ext.Viewport.setActiveItem(me.assess);
	},
	// 答案及对错评分
	assesstopicItemtap: function(list, index, target, record, e, eOpts){		
		var me = this;
		if(e.target.className=='answer'){
			answer() //评分
			return false
		}
		
		me.topicshow = Ext.create('Youngshine.view.assess.Show');
		Ext.Viewport.add(me.topicshow); //很重要，否则build后无法菜单，出错
		me.topicshow.down('panel[itemId=my_show]').setData(record.data)
		me.topicshow.show(); 
		//me.studentshow.setRecord(record); // 当前记录参数
		
		// 评分
		function answer(){
			list.overlay = Ext.Viewport.add({
				xtype: 'panel',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 320,
				height: 300,
				scrollable: true,
				styleHtmlContent: true,

		        items: [{	
		        	xtype: 'toolbar',
		        	docked: 'bottom',
					ui: 'light',
					items: [{
						xtype: 'selectfield',
						name: 'done', 
						width: 200,
						//label: '做题评分',
						//labelWidth: 150,
						autoSelect: false,
						options: [
						    {text: '做对', value: 1},
						    {text: '做错', value: 0},
							//{text: '尚未做题', value: 2},
						],
						value: record.data.done,
						defaultPhonePickerConfig: {
							doneButton: '确定',
							cancelButton: '取消'
						},
						listeners: {
							change: function(){
								this.up('panel').down('button[action=submit]').setDisabled(false)
							}
						}
					},{	
						text: '提交结果',
						ui: 'confirm',
						disabled: true,
						action: 'submit',
						handler: function(btn){
							//this.up('panel').onDone()
							done()
						}
					}]
				},{
					xtype: 'component',
					html: record.data.answer
				}],	
			})
			list.overlay.show()
			
			//评分
			function done(doneObj,view){
				var obj = {
					"done": list.overlay.down('selectfield[name=done]').getValue(), //doneObj.done,
					//'fullDone': doneObj.fullDone,
					"assesstopicID": record.data.assesstopicID
				}
				console.log(obj);
				Ext.Ajax.request({
					url: me.getApplication().dataUrl + 'updateTopicAssess.php',
					params: obj,
					success: function(response){	
						// 更新前端	
						record.set('done',obj.done)		
						//record.set('fullDone',doneObj.fullDone)
						Ext.toast('测评评分完成')
						list.overlay.destroy()
					}
				});
			}
		}
	},	
	// 向左滑动，删除
	assesstopicItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false

		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					del(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteTopicAssess.php',
			    params: {
					assesstopicID: rec.data.assesstopicID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					console.log(ret)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Topic').remove(rec);
					}		         
			    }
			});
		}
	},	
	assesstopicAddnew: function(obj,oldView){		
    	var me = this; 
		me.zsd = Ext.create('Youngshine.view.assess.Zsd');
		me.zsd.setParentRecord(obj)
		Ext.Viewport.add(me.zsd); //否则build后无法显示
		//me.topiczsd.show(); // overlay show
		
		// 当前学科年级学期的历年考试知识点hist
		var store = Ext.getStore('Zsd'); 
		store.removeAll();
		store.clearFilter()
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readZsdhistList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records)
				me.zsd.show();
				console.log(me.zsd.getParentRecord())
			}   		
		});	
	},
	// 选中测评年级学科知识点，添加其题目用于测评
	zsdChoose: function( obj,oldView)	{
    	var me = this; 
		//list.hide()
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在创建题目'});
    	Ext.Ajax.request({			
		    url: Youngshine.app.getApplication().dataUrl + 
				'readTopicAndInsert.php',
			//callbackKey: 'callback',
			//timeout: 9000,
			params: obj,
			success: function(response){ // 服务器连接成功 
				Ext.Viewport.setMasked(false);
				var ret = Ext.JSON.decode(response.responseText) //JSON.parse(response.responseText);
				console.log(ret)
				Ext.getStore('Topic').insert(0,ret); //.load()
			},
		});
	},
	// 历年考点雷达图
	assesstopicHist: function(obj)	{
    	var me = this; console.log(obj)
		
		me.assesshist = Ext.create('Youngshine.view.assess.PolarChart');
		Ext.Viewport.add(me.assesshist); //否则build后无法显示
		
		var store = Ext.getStore('Zsdhist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readZsdhistList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
				if (success){
					//Ext.Viewport.setActiveItem(me.assesshist);
					me.assesshist.show(); // overlay show
				};
			}   		
		});	
	},
	// 测评报告
	assesstopicReport: function(obj)	{
    	var me = this; 
		
		me.assessreport = Ext.create('Youngshine.view.assess.ReportChart');
		
		var student = '<div>姓名：'+obj.studentName+'</div>' + 
					  '<div>学科：'+obj.gradeName+obj.subjectName+'</div>' 
		me.assessreport.down('component[itemId=student]').setHtml(student)
		
		var store = Ext.getStore('Topic')
		var zsd = '<div>测评知识点：</div>'
		store.each(function(record){
			zsd = zsd + '<div>［'+record.data.fullDone + '］'+record.data.zsdName+'</div>'
		})
		me.assessreport.down('component[itemId=zsd]').setHtml(zsd)
		
		var store = Ext.getStore('Zsdhist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readZsdhistList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
				if (success){
					Ext.Viewport.add(me.assessreport); //否则build后无法显示
					//Ext.Viewport.setActiveItem(me.assesshist);
					me.assessreport.show(); // overlay show
				};
			}   		
		});	
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('assess controller init');
	}
});
