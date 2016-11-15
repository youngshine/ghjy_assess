/**
 * Displays a list of 教师
 */
Ext.define('Youngshine.view.teacher.List', {
    extend: 'Ext.dataview.List',
	xtype: 'teacher',

    config: {
		ui: 'round',
		store: 'Teacher',
        //itemHeight: 89,
		disableSelection: true,
		striped: true,
        itemTpl: [
            '<div>{teacherName}</div>'+
			'<div style="font-size:0.8em;"><span style="color:#888;">{subjectName}</span>'+
			//'<span class="edit" style="float:right;color:green;">编辑</span>'+
			'<span class="kcb" style="float:right;color:green;">课程表</span>'+
			'<span class="one2one" style="float:right;color:green;">一对一课时｜</span>'+
			'<span class="class" style="float:right;color:green;">大小班课时｜</span>'+
			'</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '教师',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '教师',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'
			},{
				ui : 'plain',
				disabled: true,
				action: 'addnew',
				iconCls: 'add',
				//text : '＋新增',
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
					text: '数学',
					//pressed: true,
				},{
        			text: '物理',
				},{
        			text: '化学',
				},{
        			text: '语文',
				},{
        			text: '英语',
				},{
        			text: '其它',
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

    },
	
    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew', me);

		//var vw = Ext.create('Youngshine.view.teacher.Addnew');
		//Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		//vw.down('panel[itemId=my_show]').setData(record.data)
		//vw.show(); 
		//vw.setRecord(record); // 当前记录参数
    },
	
	// 会运行两次,why"""""????? api中demo不会啊"
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
        store.filter('subjectName', subject, true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
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
