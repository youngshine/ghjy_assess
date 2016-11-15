//* Displays a list of course
Ext.define('Youngshine.view.teacher.Course', {
    extend: 'Ext.dataview.List',
	xtype: 'teacher-course',

    config: {
        //layout: 'fit',
		store: 'Course',
        //itemHeight: 89,
        //emptyText: '－－－空白－－－',
		disableSelection: true,
        itemTpl: [
			'<div style="color:#888;font-size:0.9em;"><span>{fullDate}</span>'+
			'<span style="float:right;">{studentName}</span></div>'+
			'<div>{zsdName}</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '一对一上课课时记录',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			}]
		},{
    		xtype: 'searchfield',
			scrollDock: 'top',
			docked: 'top',
			placeHolder: 'search...',
			action: 'search'
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		},{
			delegate: 'searchfield[action=search]',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onSearchChange'
		},{
			delegate: 'searchfield[action=search]',
			event: 'clearicontap',
			fn: 'onSearchClear'				
		}]	
		//selectedRecord: null,
    },
	
	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
	},
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = this.getStore();
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('zsdName', field.getValue(), true); 
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
		var me = this;
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
        	//Ext.Viewport.setActiveItem( Youngshine.app.getController('Teach').getTopicteach() );
			//this.destroy();
			me.onBack();
        };     
    }, 

});
