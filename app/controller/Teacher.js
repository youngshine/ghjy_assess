// 教师相关的控制器，
Ext.define('Youngshine.controller.Teacher', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	teacher: 'teacher',
			teacheraddnew: 'teacher-addnew',
			teacheredit: 'teacher-edit',
			teacherkcb: 'teacher-kcb',
			teachercourse: 'teacher-course',
			teachercourseassess: 'teacher-course-assess'
        },
        control: {
			teacher: {
				addnew: 'teacherAddnew', //itemtap
				itemtap: 'teacherItemtap', //包括修改、课程表按钮
				//itemswipe: 'teacherItemswipe' //delete
			},
			teacheraddnew: {
				save: 'teacheraddnewSave', 
				cancel: 'teacheraddnewCancel'
			},
			teacheredit: {
				save: 'teachereditSave', 
				cancel: 'teachereditCancel'
			},
			'teacher-course': {
				back: 'teachercourseBack',
				itemtap: 'teachercourseItemtap'
			},
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	teacherList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'teacher') return
		Ext.Viewport.remove(curView,true); //remove 当前界面
		
		me.teacher = Ext.create('Youngshine.view.teacher.List');
		Ext.Viewport.add(me.teacher);
		Ext.Viewport.setActiveItem(me.teacher);
		
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Teacher'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    //Ext.Viewport.setMasked(false);
			    if (success){
					
				};
			} 
		})	  			 
	},
	// 显示教师上课课时
	teacherItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		
		// 点击‘修改编辑’
		if(e.target.className == 'edit'){
			me.teacheredit = Ext.create('Youngshine.view.teacher.Edit');
			Ext.Viewport.add(me.teacheredit); //否则build后无法显示
			Ext.Viewport.setActiveItem(me.teacheredit); //show()?
			console.log(record.data)
			me.teacheredit.setRecord(record)
			return
		}
		
		// 点击‘教师课程表’: 大小班class和一对一student-study课程表
		if(e.target.className == 'kcb'){
			me.teacherkcb = Ext.create('Youngshine.view.teacher.Kcb');
			Ext.Viewport.add(me.teacherkcb); //否则build后无法显示
			//me.teacherkcb.show()
			//Ext.Viewport.setActiveItem(me.teacherkcb); //show()?
			console.log(record.data.teacherID)
			
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'readKcbByTeacher.php',
			    params: {
					teacherID: record.data.teacherID
			    },
			    success: function(response){
					var arr = JSON.parse(response.responseText)
					console.log(arr)
					var content = ''
					Ext.Array.each(arr, function(name, index) {
						content += name.kcType + '：' + name.timely_list + '<br>' 
					});		
					console.log(content) 
					var obj = {
						teacherName: record.data.teacherName,
						kcb: content
					}  
					me.teacherkcb.down('panel[itemId=my_show]').setData(obj)
					me.teacherkcb.show();  //overlay.show,其他Viewport.setActiveItem    
			    }
			});
			
			//me.teacheredit.setRecord(record)
			return
		}

		if(e.target.className == 'one2one'){
			if(!me.teachercourse){
				me.teachercourse = Ext.create('Youngshine.view.teacher.Course')
			}else{
				me.teachercourse.down('searchfield').setValue('')
			}		
			me.teachercourse.setRecord(record); //带入当前知识点
			//me.teachercourse.down('label[itemId=teacher]').setHtml(record.data.teacherName)
			//me.teachercourse.down('toolbar').setTitle(record.data.teacherName+'老师上课记录')
		
			Ext.Viewport.setMasked({xtype:'loadmask',message:'读取一对一上课记录'});
			// 预先加载的数据
			var obj = {
				"teacherID": record.data.teacherID,
			}
			var store = Ext.getStore('Course'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(this.getApplication().dataUrl + 
				'readCourseList.php?data='+JSON.stringify(obj) );
			store.load({ //异步async
				callback: function(records, operation, success){
					Ext.Viewport.setMasked(false);
					if (success){
						Ext.Viewport.add(me.teachercourse) // build?
						Ext.Viewport.setActiveItem(me.teachercourse);
					}else{
						Ext.toast(result.message,3000);
					};
				}   		
			});	
		}
	},
	
	// 向左滑动，删除， 禁用！
	teacherItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false
		
		return // 咨询师不呢删除教师
			
		var me = this;
		list.select(index,true); // 高亮当前记录，必须disableSelection=true
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
			    url: me.getApplication().dataUrl + 'deleteTeacher.php',
			    params: {
					teacherID: rec.data.teacherID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Teacher').remove(rec);
					}		         
			    }
			});
		}
	},	

	teacherAddnew: function(win){		
		var me = this;

		me.teacheraddnew = Ext.create('Youngshine.view.teacher.Addnew');
		Ext.Viewport.add(me.teacheraddnew)

		Ext.Viewport.setActiveItem(me.teacheraddnew)
	},
	
	// 取消添加
	teacheraddnewCancel: function(oldView){		
		var me = this;
		Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.teacher);
	},	
	teacheraddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createTeacher.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				//oldView.destroy()
				obj.teacherID = result.data.teacherID
				//obj.created = new Date();
				Ext.getStore('Teacher').insert(0,obj)
				
				Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
				Ext.Viewport.setActiveItem(me.teacher);
		    }
		});
	},
	// 取消添加
	teachereditCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.teacheredit,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.teacher);
	},	
	teachereditSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateTeacher.php',
		    params: obj,
		    success: function(result){
		        //var text = response.responseText; JSON.parse()
				console.log(result)
				//Ext.Viewport.setActiveItem(me.student);
				//rec.set(obj) //前端更新显示
				Ext.toast('修改成功',3000)
				Ext.Viewport.setActiveItem(me.teacher);
				Ext.Viewport.remove(me.teacheredit,true); //remove 当前界面
		    }
		});
	},
	
	// 返回
	teachercourseBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		//console.log(me.teacher)	
		Ext.Viewport.setActiveItem(me.teacher);
		//Ext.Viewport.remove(me.teachercourse,true); //remove 当前界面
	},
	// 显示该堂课时的家长评价
	teachercourseItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		me.teachercourseassess = Ext.create('Youngshine.view.teacher.course.Assess');
		//Ext.Viewport.add(me.teachercourseassess); //否则build后无法显示
		
		// ajax instead of jsonp 课时评价
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'readCourseAssess.php',
		    params: {
				courseID: record.data.courseID
		    },
		    success: function(response){
				var ret = JSON.parse(response.responseText)
				console.log(response)
				//add,否则build后无法显示
				Ext.Viewport.add(me.teachercourseassess);
				me.teachercourseassess.down('panel[itemId=my_show]').setData(ret)
				me.teachercourseassess.show(); 	         
		    }
		});
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('teach controller init');
	}
});
