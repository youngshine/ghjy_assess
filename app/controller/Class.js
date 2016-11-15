// 咨询师所属分校区schoolsub大小班级相关
Ext.define('Youngshine.controller.Class', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
			class: 'class',
			classattendee: 'class-attendee',
        },
        control: {
			class: {
				itemtap: 'classItemtap', 
			},
			'class-attendee': {
				back: 'classattendeeBack',
			},
        }
    },

	// sidemenu跳转这里：班级
	classList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'class') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.class = Ext.create('Youngshine.view.class.List');
		Ext.Viewport.add(me.class);
		Ext.Viewport.setActiveItem(me.class);

		//Ext.Viewport.setActiveItem(me.classes);
		//view.onGenreChange(); //默认
		var obj = {
			"schoolID": localStorage.schoolID,
			"schoolsubID": localStorage.schoolsubID,
			"consultID": localStorage.getItem('consultID'),
			"teacherID": 0 //班级尚未确定教师
		}		
		var store = Ext.getStore('Classes');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readClassesList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    console.log(records)
				if (success){
					
				};
			} 
		})	  			 
	},

	classItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 

		me.classattendee = Ext.create('Youngshine.view.class.Attendee');
		me.classattendee.setParentRecord(record)
		me.classattendee.down('label[itemId=title]').setHtml(record.data.title)
		Ext.Viewport.add(me.classattendee) // build?
		Ext.Viewport.setActiveItem(me.classattendee);

		var obj = {
			"classID": record.data.classID,
			//"subjectID": record.data.subjectID, //题目按学科分3个表
		};
		console.log(obj)
		var store = Ext.getStore('Attendee'); 
		store.removeAll();
		store.clearFilter()
        var url = this.getApplication().dataUrl + 
			'readAttendeeList.php?data=' + JSON.stringify(obj);
		store.getProxy().setUrl(url);
        store.load({
			callback: function(records, operation, success){
				console.log(records)
				if (success){
					
				}else{
					Ext.toast(result.message,3000);
				};
			} 
        }); 
	},	

	// 返回
	classattendeeBack: function(oldView){		
		var me = this;
		Ext.Viewport.remove(me.classattendee,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.class);
	},
	
	
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('class controller init');
	}
});
