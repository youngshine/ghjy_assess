/**
 * Displays a list of 各个校区咨询的班级及其学生 product as pricelist
 * 在这里转班，class_student.current=0
*/
Ext.define('Youngshine.view.classes.ListDataview', {
    extend: 'Ext.Container',
	xtype: 'classes-dataview',

    config: {
		layout: 'fit',
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '大小班级管理',
				handler: function(btn){
					//btn.up('main').onMenu()
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
				//ui : 'action',
				action: 'addnew',
				iconCls: 'add',
				//text : '＋新增',
				action: 'addnew'	
			}]
			
		},{
			xtype: 'label',
			docked: 'top',
			html: '<span class="classall">全校班级>></span>',
			//itemId: 'zsd',
			style: 'text-align:center;color:green;margin:10px;'
			
		},{
			xtype: 'dataview',
			store: 'Classes',
			inline: true,
			scrollable: true,
			style: 'text-align:center;margin:10px 0px',
	        itemTpl: '<div style="background:#fff;margin:5px;padding:10px;width:180px;">'+
				'<div>{title}</div><hr>'+
				'<div style="color:#888;font-size:0.8em;">满员：{enroll} / {persons}</div>'+
				'<div style="color:#888;font-size:0.8em;">上课：{timely_list}</div>'+
				'<div style="color:#888;font-size:0.8em;">教师：{teacherName}</div>'+
				'<br><div style="color:green;"><span class="edit">编辑</span>｜'+
				'<span class="del">删除</span></div></div>'
    	}],
		
		listeners: [{
			delegate: 'dataview',
			event: 'itemtap',
			fn: 'onItemtap'
		},{
			delegate: 'button[action=addnew]',
			event: 'tap',
			fn: 'onAddnew'	
		},{
			delegate: 'searchfield[action=search]',
			event: 'change', // need return to work
			//event: 'keyup',
			fn: 'onSearchChange'	
		},{
			element: 'element',
			delegate: 'span.classall',
			event: 'tap',
			fn: 'onClassAll'
		}]
    },

    onAddnew: function(btn){
		this.fireEvent('addnew',this)
    },
    onItemtap: function(dataview, index, target, record,e){
		this.fireEvent('itemtap',dataview, index, target, record,e)
    },
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		//var store = Ext.getStore('Orders');
		var store = this.down('dataview').getStore(); 
		store.clearFilter();
        store.filter('title', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},
	
	// 全校班级，按分校区分组，咨询面对家长营销用
	onClassAll: function(){
		this.fireEvent('all', this)
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
