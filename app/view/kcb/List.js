// 待排课
Ext.define('Youngshine.view.kcb.List', {
    extend: 'Ext.dataview.List',
	xtype: 'kcb',

    config: {
        layout: 'fit',
		//record: null,
		ui: 'round',
		store: 'Study',
		disableSelection: true,
		striped: true,
        //itemHeight: 89,
        //emptyText: '－－－空白－－－',
        itemTpl: [
			'<div>{zsdName}</div>'+
			'<div style="color:#888;font-size:0.8em;">'+
			'{gradeName}{subjectName}｜{studentName}</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '待排课的',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '待排课的',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 	
			}]
    	}],
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
			//this.destroy();
        };     
    }, 
});
