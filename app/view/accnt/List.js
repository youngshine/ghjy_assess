/**
 * Displays a list of 缴费记录
 */
Ext.define('Youngshine.view.accnt.List', {
    extend: 'Ext.dataview.List',
	xtype: 'accnt',
	
    config: {
		//record: null, //父窗口传递的记录参数
		//ui: 'round',
		store: 'Accnt',
		//grouped: true,
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span>{studentName}</span>'+
			'<span style="float:right;">{amount}元</span></div>'+
			'<div style="color:#888;"><span>{accntDate}</span>'+
			'<span style="float:right;">应收{amount_ys}元</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '课时套餐订单',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '报读课程缴费',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'	
			},{
                xtype: 'searchfield',
                placeHolder: 'Search...',
				action: 'search',
			},{
				xtype: 'spacer'
			},{
				ui : 'plain',
				action: 'addnew',
				iconCls: 'add',
				handler: function(){
					this.up('list').onAddnew()
				}		
			}]
		},{
			xtype: 'toolbar',
			docked: 'top',
			ui: 'gray',
			items: [{
				width: '100%',
				padding: '0 0',
				defaults: {flex: 1},
				xtype: 'segmentedbutton',
				allowDepress: false,
				//allowMultiple: false,
				//allowToggle: false,
				items: [{
					text: '大小班',
					pressed: true,
				},{
        			text: '一对一',
				},{
					text: '退费退班',	
				}], ///* 会同时触发2次，api示例不会啊
				listeners:{
			        toggle: function(container, button, pressed){
			            console.log(pressed)
						if(pressed){
							button.up('list').onToggle(button.getText())
						} //toggle会运行两次
							
			        }
				} //*/
			}]		
    	}],	
		
    	listeners: [{
			delegate: 'searchfield[action=search]',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onSearchChange'
		},{
			delegate: 'searchfield[action=search]',
			event: 'clearicontap',
			fn: 'onSearchClear'	 						
    	}]
    },

	// 会运行两次,why"""""????? api中demo不会啊"
	onToggle: function(pressed){
		var me = this; console.log(pressed)
		//var text = selBtn.getText()
		var store = me.getStore(); //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('accntType', pressed); 
	},
    onAddnew: function(btn){
		var me = this;
		var accntType = me.down('segmentedbutton').getPressedButtons()[0].getText()
		console.log(accntType)
		//var action = accntType == '一对一' ? 'addnew_1to1' : 'addnew_class'
		me.fireEvent('addnew', accntType,me);
		//me.fireEvent(action, accntType,me);
    },
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var me = this;
		var accntType = me.down('segmentedbutton').getPressedButtons()[0].getText()
		var student = field.getValue()
		var student = new RegExp("/*" + student); // 正则表达式
		var store = this.getStore();
		store.clearFilter();
        //store.filter('studentname', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
		store.filter([
			{property: "accntType", value: accntType},
			{property: "studentName", value: student}, // 姓名模糊查找？？
		]);
	},	
    onSearchClear: function(field){
		var accntType = this.down('segmentedbutton').getPressedButtons()[0].getText()
		var store = this.getStore();
		store.clearFilter();
		store.filter('accntType', accntType, true);
	},	// search end
	
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
    },   
    onElSwipe : function(e) {
        console.log(e.target)
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
        	Youngshine.app.getApplication().getController('Main').menuNav()
        };     
    }, 
});
