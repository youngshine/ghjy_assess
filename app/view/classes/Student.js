// 查找选择学生
Ext.define('Youngshine.view.classes.Student',{
	extend: 'Ext.dataview.List',
	xtype: 'classes-student',

	config: {
		parentRecord: null, //父表记录参数
		
		striped: true,
		store: 'Student',
		itemTpl: '{studentName}<span style="float:right;">{grade}</span>',
        // We give it a left and top property to make it floating by default
        right: 0,
        top: 0,
		width: 420,height: '100%',
		border: 5,
		style: 'border-color: #555; border-style: solid;',

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
				itemId: 'grade', 
				placeHolder: '选择年级',
				width: 150,
				autoSelect: false,
				options: [
				    {text: '九年级', value: '九年级'},
				    {text: '八年级', value: '八年级'},
				    {text: '七年级', value: '七年级'},
				    {text: '六年级', value: '六年级'},
				    {text: '五年级', value: '五年级'},
				    {text: '四年级', value: '四年级'},
				    {text: '三年级', value: '三年级'},
				    {text: '二年级', value: '二年级'},
				    {text: '一年级', value: '一年级'}
				],	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{	
            	xtype: 'searchfield',
				placeHolder: 'search',
				width: 150
			
            }]
        }],
		
    	listeners: [{
			delegate: 'searchfield',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onFilter' 
		},{
			delegate: 'searchfield',
			event: 'clearicontap',
			fn: 'onFilter' 
		},{
			delegate: 'selectfield[itemId=grade]',
			event: 'change', // need return to work
			fn: 'onFilter'						
    	}]
	},

	// 搜索过滤
    onFilter: function(){
		var grade = this.down('selectfield[itemId=grade]').getValue(),
			search = this.down('searchfield').getValue().trim()
		search = new RegExp("/*" + search); // 正则表达式，模糊查询
		var store = this.getStore(); //得到list的store: Myaroundroute
		store.clearFilter(); //filter is additive
		// 正则表达，才能模糊搜索?? true就可以anymatch
        //store.filter('studentName', field.getValue(), true); 
		store.clearFilter(); // filter is additive
		if(grade != null ){
			store.filter([
				{property: "grade", value: grade},
				{property: "fullStudent", value: search}, // 姓名＋手机
			]);
		}else{
			store.filter("fullStudent", search, true);
		}
		console.log(search,grade)	
	},	
});