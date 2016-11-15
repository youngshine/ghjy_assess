Ext.define('Youngshine.view.member.Edit', {
    extend: 'Ext.form.Panel',
    xtype: 'member',

    config: {
        showAnimation: {
            type: "slideIn",
            direction: "left",
            duration: 200
        },
        hideAnimation: {
            type: "slideOut",
            direction: "right",
            duration: 200
        },
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '修改资料',
			items: [{
				text: '返回',
				ui: 'back',
				handler: function(btn){
					btn.up('panel').onBack();
					//Ext.Viewport.remove(Ext.Viewport.getActiveItem(),true);
				}	
			}]
		},{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 65,
				xtype: 'textfield'
			},
			//title: '个人资料',
			items: [{
				xtype: 'textfield',
				name: 'member_name', //绑定后台数据字段
				label: '姓名',
				//value: localStorage.a,
				clearIcon: false
			},{	
				xtype: 'textfield',
				name: 'member_addr', //绑定后台数据字段
				label: '地址',
				clearIcon: false
			},{	
				xtype: 'textfield',
				name: 'member_phone', //绑定后台数据字段
				label: '电话',
				clearIcon: false,
				component: { // 显示数字键
					xtype: 'input',
					type: 'tel'
				}	
			},{	
				xtype: 'hiddenfield',	
				name: 'openID', //绑定后台数据字段
				value: localStorage.openID //sessionStorage.openID		
			}]	
		},{
			xtype: 'button',
			ui: 'action',
			text: '保存',
			margin: '0 15',
			action: 'save'	
		}],		
	
		listeners: [{
			delegate: 'button[action=save]',
			event: 'tap',
			fn: 'onSave'	
		}]
	},

	// it's bad to use listeners config obj in Ext.define(), use it in instanialiing create()
	initialize: function(){	
        this.callParent(arguments);	
		this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
	},  
    onElSwipe : function(e) {
        if(e.direction=='right'){
        	this.onBack(); //destroy();
        };     
    },
	onBack: function(){
		var me = this;
		
		var vw = Youngshine.app.getController('Main').mainview //.getMainview(); //先显示前一画面，动画切换才顺滑
		console.log(vw)
		Ext.Viewport.setActiveItem(vw);	
		me.hide();
		setTimeout(function(){ //延迟，才能hide config动画，滚动到最后4-1
			me.destroy();
		},300);	
	},
	
	onSave: function(){
		var me = this;

		var member_name = this.down('textfield[name=member_name]').getValue().trim();
		var member_phone = this.down('textfield[name=member_phone]').getValue().trim(); 
		var member_addr = this.down('textfield[name=member_addr]').getValue().trim(); 
		//var member_gender = '';
	
		if (member_name == ''){
			Youngshine.app.getController('Main').alertMsg('请填写姓名',2000)
			return;
		}
		var obj = {
			member_name: member_name,
			member_phone: member_phone,
			member_addr: member_addr,
			member_gender: '无',
			openID: localStorage.openID 
			//member_id: member_id
		};
		me.fireEvent('membereditSave', obj,me);
	},
	
});
