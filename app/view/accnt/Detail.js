// 学生的报读内容（知识点）
Ext.define('Youngshine.view.accnt.Detail',{
	extend: 'Ext.Sheet',
	xtype: 'accnt-detail',

	config: {
		//floating: true,
		//centered: true,
		// We give it a left and top property to make it floating by default
		//scrollable: 'vertical',
		enter: 'right',
		exit: 'right',
		right: 0,
		//top: 0,
		width: '67%',
		stretchY: true,

		hideOnMaskTap: true,
		modal: true, 
		
		styleHtmlContent: true,
		style: 'background:#fff;border-radius:10px 0 0 10px;',
		//cls: 'x-confirm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
		items: [{
			xtype: 'panel',
			scrollable: 'vertical',
			itemId: 'my_show',
			tpl: [
				'<div>购买内容</div><hr>',
				'<div>{content}</div>',
			].join(''),
			flex: 1 
			/*},{	
			xtype: 'button',
			text: '确定',
			style: 'margin-top:5px;',
			//docked: 'bottom',
			//margin: '15 30',
			handler: function(){
				this.up('sheet').hide();
			}	*/
		}],
		
		hidden: true,
		record: null, //保存当前记录参数，setRecord, updateRecord
	},

    hide: function(animation) {
        this.callParent();
		this.destroy();
    },
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        //it's important to callParent to not break inheritance
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElementSwipe', //not use anonymous functions
			//tap	  : 'onTapToHide',
        });
    },   
    // swipe right to return to the previous
    onElementSwipe : function(e) {
        //fire event on component so swipe event is now on the component
        if(e.direction=='right'){
        	this.hide();
        };     
    },  	
    onTapToHide : function(e) {
        this.hide();    
    },
});