// 查找选择 指定 班级任课教师
Ext.define('Youngshine.view.classes.Teacher',{
	extend: 'Ext.dataview.List',
	xtype: 'classes-teacher',

	config: {
		parentRecord: null, //父表
		striped: true,
		store: 'Teacher',
		itemTpl: '{teacherName}［{gender}］<span style="float:right;">{subjectName}</span>',
        // We give it a left and top property to make it floating by default
        centered: true,
		width: 400,height: '100%',
		border: 5,
		style: 'border-color: black; border-style: solid;',

        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: true,

        // Make it hidden by default
        hidden: true,
        scrollable: true,

        // Insert a title docked at the top with a title
        items: [{
            docked: 'top',
            xtype: 'toolbar',
			ui: 'light',
            items: [{
				text: '确定',
				ui: 'confirm',
				disabled: true,
				action: 'choose'
			},{
				xtype: 'spacer'
			},{		
            	xtype: 'searchfield',
				placeHolder: '搜索教师'
            }]
        }],
		
    	listeners: [{
			delegate: 'searchfield',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onSearchChange' 						
    	}]
	},

	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = Ext.getStore('Teacher');
		store.clearFilter();
        store.filter('teacherName', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},	
	
	initialize: function(){
		this.callParent(arguments)
		this.on('select',this.onSelect)
	},
	onSelect: function(list, record){
		var me = this
		me.down('button[action=choose]').setDisabled(false)
		console.log(me.getParentRecord())
		me.down('button[action=choose]').on('tap',function(){
			var obj = {
				teacherID: record.data.teacherID,
				teacherName: record.data.teacherName,
				classID: me.getParentRecord().data.classID
		    }
			console.log(obj);	
			me.fireEvent('choose',obj,me.getParentRecord(),me)
			me.destroy()
		})
	},
});