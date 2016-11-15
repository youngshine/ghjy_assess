// 选择一对一课程，并输入购买课时
Ext.define('Youngshine.view.accnt.KclistOne2one',{
	extend: 'Ext.Panel',
	xtype: 'kclist-one2one',

	config: {
		modal: true,
		hideOnMaskTap: true,
		centered: true,
		//left:0,bottom:0,
		width: '80%',
		//height: 280,
		layout: 'vbox',

        items: [{	
        	xtype: 'toolbar',
        	docked: 'top',
        	title: '课程及课时',
			items: [{
				text : '完成',
				ui: 'confirm',
				action: 'done',	
			}]
		},{
			xtype: 'fieldset',
			//width: '98%',
			items: [{
				xtype: 'selectfield',
				label: '课程', 
				labelWidth: 85,
				itemId: 'kclist',
				displayField: 'title',
				valueField: 'kclistID',
				store: 'Kclist',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'numberfield',
				label: '购买课时', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				itemId: 'hour',
				//value: 0,
			},{
				xtype: 'numberfield',
				label: '单价',
				labelWidth: 85,
				itemId: 'unitprice',
				//value: 0,
				disabled: true
			},{
				xtype: 'hiddenfield',
				itemId: 'title', // 课程名称，用于前端显示
			}]	
		}],	
		
    	listeners: [{
			delegate: 'button[action=done]',
			event: 'tap',
			fn: 'onDone' 
		},{
			delegate: 'selectfield[itemId=kclist]',
			event: 'change', // need return to work
			fn: 'onKclistChange'						
    	}]
	},

	onDone: function(btn){
		var me = this;
		var kclistID = me.down('selectfield[itemId=kclist]').getValue(),
			title = me.down('hiddenfield[itemId=title]').getValue(),
			unitprice = me.down('numberfield[itemId=unitprice]').getValue(),
			hour = me.down('numberfield[itemId=hour]').getValue(),
			amount = 0 // 一对一用单价
		if (kclistID == null){
			Ext.toast('请选择课程',3000); return;
		}
		if (hour == 0 || hour == null ){
			Ext.toast('请填写购买课时',3000); return;
		}
		
		var obj = {
			kclistID: kclistID,
			title: title,
			hour: hour,
			unitprice: unitprice,
			amount: hour*unitprice
		}
		console.log(obj)
		me.fireEvent('done',obj,me);
		me.destroy()
	},
	
	// 选择一对一课程，自动单价
	onKclistChange: function(sel, newValue, oldValue, eOpts){
		var me = this; 
		var store = sel.getStore();
		store.each(function(record){
			if(record.data.kclistID == newValue ){
				me.down('hiddenfield[itemId=title]').setValue(record.data.title)
				me.down('numberfield[itemId=unitprice]').setValue(record.data.unitprice)
			}
			console.log(record.data)
		})
	},	
});