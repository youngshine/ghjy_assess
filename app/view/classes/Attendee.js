// 班级的子表：报读的学生，可能上的课时各不相同
Ext.define('Youngshine.view.classes.Attendee', {
    extend: 'Ext.dataview.List',
	xtype: 'classes-attendee',

    config: {
        layout: 'fit',
		parentRecord: null,
		
		store: 'Attendee',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span>{studentName}</span>'+
			'<span class="removeItem" style="float:right;color:red;">移出</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '班级学生',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			},{
				xtype: 'spacer'
			},{
				text: '结束班级',
				ui: 'decline',
				action: 'finish'
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'title',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
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
    },

    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew',me.getParentRecord(), me);
    },	
	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
	},
});
