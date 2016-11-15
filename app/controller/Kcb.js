// 排课相关的控制器，
Ext.define('Youngshine.controller.Kcb', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	kcb: 'kcb',
			kcbteacher: 'kcb-teacher',
        },
        control: {
			kcb: {
				itemtap: 'kcbItemtap', //包括'排课‘’
			},
			kcbteacher: {
				done: 'kcbteacherDone', 
			},
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	kcbList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'kcb') return
 		
		// 先view，再data，会显示loading
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.kcb = Ext.create('Youngshine.view.kcb.List');
		Ext.Viewport.add(me.kcb);
		Ext.Viewport.setActiveItem(me.kcb);
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"teacherID"  : 0
		}		
		var store = Ext.getStore('Study');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudyListByKcb.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    //Ext.Viewport.setMasked(false);
			    if (success){
					
				};
			} 
		})	  			 
	},

	// 排课：单击‘排课kcb’
	kcbItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		
		//if(e.target.className == 'kcb'){
			me.kcbteacher = Ext.create('Youngshine.view.kcb.Teacher');
			Ext.Viewport.add(me.kcbteacher); //否则build后无法显示
			//me.studykcb.show()
			console.log(record.data)
			me.kcbteacher.setRecord(record)
			
			// 任课教师selectfield，没有store,这样才能显示名字
			var selectBox = me.kcbteacher.down('selectfield[name=teacherID]')
			console.log(selectBox)
			selectBox.setOptions([
			    {teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
			    //{text: 'Third Option',  value: 'third'}
			])
			selectBox.setValue(record.data.teacherID);
			console.log(selectBox.getValue())
		//}	
	},	
	
	// 排课：分配任课教师及上课时间
	kcbteacherDone: function(obj,oldView)	{
    	var me = this; alert('done')
		Ext.Ajax.request({
			url: me.getApplication().dataUrl +  'updateStudyByKcb.php',
			params: obj,
            success: function(response){
				Ext.toast('排课成功',3000)
				oldView.destroy()	
				// 要即时更新前端数据才能正确显示	record.set(obj)
            }
		})
	},

			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('kcb controller init');
	}
});
