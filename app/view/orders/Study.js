// 课时套餐的子表：报读知识点记录
Ext.define('Youngshine.view.orders.Study', {
    extend: 'Ext.dataview.List',
	xtype: 'orders-study',

    config: {
        layout: 'fit',
		record: null,
		
		store: 'Study',
		disableSelection: true,
		striped: true,
        //itemHeight: 89,
        //emptyText: '－－－空白－－－',
        itemTpl: [
			'<div><span>{zsdName}</span>'+
			'<span style="float:right;color:#888;">{times}课时</span></div>'
			//'<span class="kcb" style="float:right;color:green;">排课</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '报读知识点',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'taocan',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
		},{
    		xtype: 'button',
			text: '＋添加记录',
			action: 'addnew',
			ui: 'plain',
			scrollDock: 'bottom',
			docked: 'bottom',
			style: 'color:green;margin-top:10px;'
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		},{
			delegate: 'button[action=addnew]',
			event: 'tap',
			fn: 'onAddnew'		
		}]
		
		//selectedRecord: null,
    },

    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew',btn, me);
    },	
	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
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
