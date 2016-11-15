/**
 * Displays a list of 测评记录列表
 */
Ext.define('Youngshine.view.assess.List', {
    extend: 'Ext.dataview.List',
	xtype: 'assess',
	
    config: {
		ui: 'round',
		store: 'Assess',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
		pinHeaders: false,
        itemTpl: [
			'<div>{studentName}'+
			'<span style="float:right;color:#888;">'+
			'{subjectName}｜{gradeName}{semester}｜{fullDate}</span>'+
			'</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '测评记录',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '测评记录',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'	
			},{
                xtype: 'searchfield',
                placeHolder: 'Search...',
				//width: 150,
				//label: '测评记录',
				action: 'search',
                listeners: {
                    scope: this,
                    //clearicontap: this.onSearchClearIconTap,
                    //keyup: this.onSearchKeyUp
                }
			},{
				xtype: 'spacer'	
			},{
				ui : 'action',
				action: 'addnew',
				iconCls: 'add',
				//text: '新增',
				handler: function(){
					this.up('list').onAddnew()
				}		
			}]
/*		},{
    		xtype: 'searchfield',
			scrollDock: 'top',
			docked: 'top',
			placeHolder: 'search...',
			action: 'search' */
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
	
	/*
	initialize: function(){
		this.callParent(arguments)
		//this.on('itemtap',this.onItemtap)
	},
	
	// 显示详情
    onItemtap: function(list, index, item, record){
		var vw = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		vw.down('panel[itemId=my_show]').setData(record.data)
		vw.show(); 
		vw.setRecord(record); // 当前记录参数
    }, */
    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew', me);
    },
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		//var store = Ext.getStore('Orders');
		var store = this.getStore(); 
		store.clearFilter();
        store.filter('studentName', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},	
    onSearchClear: function(field){
		var store = this.getStore(); //Ext.getStore('Orders');
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
