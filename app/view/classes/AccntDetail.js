/**
 * Displays a list of 缴费购买课时套餐 accnt instead of prepaid
 */
Ext.define('Youngshine.view.classes.AccntDetail', {
    extend: 'Ext.dataview.List',
	xtype: 'accnt-detail',
	
    config: {
		//ui: 'round',
		store: 'AccntDetail',
		grouped: true,
		//disableSelection: true,
		//onItemDisclosure: true,
		striped: true,
        itemTpl: [
			'{studentName}<span style="float:right;color:#888;">{title}</span>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '课时套餐订单',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '待分班学生',
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

	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = this.getStore();
		store.clearFilter();
        store.filter('studentName', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},	
    onSearchClear: function(field){
		var store = this.getStore();
		store.clearFilter();
	},	
	
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
