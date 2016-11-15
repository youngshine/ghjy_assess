// 班级对应的课程
Ext.define('Youngshine.view.classes.Kclist',{
	extend: 'Ext.dataview.List',
	xtype: 'class-kclist',

	config: {
		striped: true,
		disableSelection: true,
		store: 'Kclist',
		itemTpl: '<div>{title}</div>'+
			'<div style="color:#888;"><span>{hour}课时{amount}元</span>'+
			'<span style="float:right;">{kmType}</span></div>',
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
				itemId: 'kclistType',
                placeHolder: '选择课程类别',
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
			delegate: 'selectfield[itemId=kclistType]',
			event: 'change', // need return to work
			fn: 'onFilter'						
    	}]
	},

	// 搜索过滤
    onFilter: function(){
		var kclistType = this.down('selectfield[itemId=kclistType]').getValue(),
			search = this.down('searchfield').getValue().trim()
		console.log(search)
		search = new RegExp("/*" + search); // 正则表达式，模糊查询
		var store = this.getStore(); //得到list的store: Myaroundroute
		store.clearFilter(); //filter is additive
		// 正则表达，才能模糊搜索?? true就可以anymatch
        //store.filter('studentName', field.getValue(), true); 
		store.clearFilter(); // filter is additive
		if(kclistType != null ){
			store.filter([
				{property: "kmType", value: kclistType},
				{property: "title", value: search}, // 姓名＋手机
			]);
		}else{
			store.filter("title", search, true);
		}
		console.log(search,kclistType)	
	},	
});