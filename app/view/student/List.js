/**
 * Displays a list of 报读某个知识点的学生列表
 */
Ext.define('Youngshine.view.student.List', {
    extend: 'Ext.dataview.List',
	xtype: 'student',

    //id: 'studentList',

    config: {
		//record: null,
		//layout: 'fit',
		//ui: 'round',
		store: 'Student',
		//grouped: true,
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
            '<div>{studentName}</div>'+
			'<div style="color:green;">'+
			'<span style="color:#888;">{phone}</span>'+ 
			'<span class="assess" style="float:right;">｜测评</span>'+
			'<span class="qrcode" style="float:right;">扫码</span>'+
			'</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '注册学生',
			items: [{
				text: '学生',
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					//btn.up('main').onMenu()
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'	
			},{
                xtype: 'searchfield',
                placeHolder: '搜索姓名、电话...',
				clearIcon: false,
				//width: 150,
				//label: '测评记录',
				action: 'search',
			},{
				xtype: 'spacer'
			},{
				ui : 'plain',
				action: 'addnew',
				iconCls: 'add',
				//text : '＋新增',
				handler: function(){
					this.up('student').onAddnew()
				}		
			}]
    	}],
		
    	listeners: [{
			delegate: 'searchfield[action=search]',
			event: 'change', // need return to work
			//event: 'keyup',
			fn: 'onSearch' 						
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
    onAddnew: function(list, index, item, record){
		this.fireEvent('addnew',this)
    },
	
	// 搜索过滤
    onSearch: function(field,newValue,oldValue){
		var obj = {
			"val": field.getValue(),
			"schoolID" : localStorage.schoolID,
			"schoolsubID" : localStorage.schoolsubID  
			//来自公众号的学生，没有归属咨询师怎么办？让校长归属 
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
		        if (success){
					
				};
			}   		
		});	
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
