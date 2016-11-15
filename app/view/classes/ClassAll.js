// 全校所有班级，按分校区分组
Ext.define('Youngshine.view.classes.ClassAll', {
    extend: 'Ext.dataview.List',
	xtype: 'class-all',

    config: {
        layout: 'fit',

		store: '', //动态
		grouped: 'fullname',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div>{title}<span style="float:right;">{enroll} / {persons}</span></div>'+
			'<div style="color:#888;">{timely_list}'+
			'<span style="float:right;">教师：{teacherName}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '全校班级',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
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
					text: '数理化',
					//pressed: true,
				},{
        			text: '语政英',
				},{
        			text: '史地生',
				},{
        			text: '艺术',
				}], ///* 会同时触发2次，api示例不会啊
				listeners:{
			        toggle: function(container, button, pressed){
			            console.log(pressed)
						if(pressed){
							button.up('list').onToggle(button)
						} //toggle会运行两次
							
			        }
				} //*/
			}]	
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		}]
    },

	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
	},
	
	onToggle: function(selBtn){
		var me = this; 
		//console.log(seg.getPressedButtons()[0].getText())
		//console.log(this.down('segmentedbutton').getPressedButtons()[0].getText())
		//var segbtn = this.down('segmentedbutton');
		console.log(selBtn.getText())
		//me.fireEvent('segmentedbuttonToggle', segbtn,me);

		var subject = selBtn.getText(),
			store = me.getStore(); //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('kmType', subject, true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},
});
