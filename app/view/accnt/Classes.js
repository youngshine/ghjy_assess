// 多选添加报读班级
Ext.define('Youngshine.view.accnt.Classes',{
	extend: 'Ext.dataview.List',
	xtype: 'accnt-classes',

	config: {
		striped: true,
		disableSelection: true,
		store: 'Classes',
		itemTpl: '<div>{title}</div>'+
			'<div style="color:#888;"><span>{weekday}{timespan}</span>'+
			'<span style="float:right;">教师：{teacherName}</span></div>',
        // We give it a left and top property to make it floating by default
        right: 0,
        top: 0,
		width: 420,height: '100%',
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
				xtype: 'selectfield',
				itemId: 'classType',
                placeHolder: '选择班级科目',
				width: 180,
                options: [
					{text: '数理化', value: '数理化'},
				    {text: '史地生', value: '史地生'},
					{text: '语政英', value: '语政英'},
				    {text: '艺术', value: '艺术'}
                ],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
            	xtype: 'searchfield',
				width: 180,
				placeHolder: '搜索...'	
            }]
        }],
		
    	listeners: [{
			delegate: 'searchfield',
			event: 'change', // need return to work
			//event: 'keyup',
			fn: 'onFilter' 
		},{
			delegate: 'searchfield',
			event: 'clearicontap',
			fn: 'onFilter' 
		},{
			delegate: 'selectfield[itemId=classType]',
			event: 'change', // need return to work
			fn: 'onFilter'						
    	}]
	},

	// 搜索过滤
    onFilter: function(){
		var classType = this.down('selectfield[itemId=classType]').getValue(),
			search = this.down('searchfield').getValue().trim()
		console.log(search)
		search = new RegExp("/*" + search); // 正则表达式，模糊查询
		var store = this.getStore(); //得到list的store: Myaroundroute
		store.clearFilter(); //filter is additive
		// 正则表达，才能模糊搜索?? true就可以anymatch
        //store.filter('studentName', field.getValue(), true); 
		store.clearFilter(); // filter is additive
		if(classType != null ){
			store.filter([
				{property: "classType", value: classType},
				{property: "title", value: search}, // 姓名＋手机
			]);
		}else{
			store.filter("title", search, true);
		}
		console.log(search,classType)	
	},	
});