// 查找选择学生
Ext.define('Youngshine.view.assess.Student',{
	extend: 'Ext.dataview.List',
	xtype: 'assess-student',

	config: {
		striped: true,
		store: 'Student',
		itemTpl: '{studentName}<span style="float:right;">{grade}</span>',
        // We give it a left and top property to make it floating by default
        //right: 0,
        //top: 0,
		width: 400,height: '75%',
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
            	xtype: 'searchfield',
				placeHolder: '搜索学生'
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
		var store = Ext.getStore('Student');
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('studentName', field.getValue(), true); // 正则表达，才能模糊搜索?? true就可以anymatch
	},	
});