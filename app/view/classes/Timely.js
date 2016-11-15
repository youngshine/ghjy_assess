// 选择上课时间：星期＋具体开始上课时间
Ext.define('Youngshine.view.classes.Timely',{
	extend: 'Ext.Panel',
	xtype: 'classes-timely',
	
	//requires: ['Ext.ux.TimePickerField'],

	config: {
		parentView: null, //谁调用我？
		modal: true,
		hideOnMaskTap: true,
		//centered: true,
		left:0,bottom:0,
		//centered: true,
		width: '100%',
		//height: 280,
		layout: 'vbox',

        items: [{	
        	xtype: 'toolbar',
			ui: 'light',
        	docked: 'top',
        	//title: '设置上课周期',
			items: [{
				text : '完成',
				ui: 'confirm',
				action: 'done',	
			},{
				xtype: 'spacer'	
			},{
				xtype: 'label',
				html: '滑动设置时间：'	
			},{
				xtype: 'label',
				name: 'timely', 
				//label: '.',
				html: '周一08:00',
				style: {
					color:'#ddd'
				},
				//placeHolder: '滑动设置上课时间',
				//readOnly: true	
			},{
				xtype: 'spacer'	
			}]
		},{
			xtype: 'fieldset',
			//width: '98%',
			items: [{ /*
				xtype: 'selectfield',
				name: 'weekday', 
				label: '星期',
				options: [
				    {text: '周一', value: '周一'},
				    {text: '周二', value: '周二'},
				    {text: '周三', value: '周三'},
				    {text: '周四', value: '周四'},
				    {text: '周五', value: '周五'},
				    {text: '周六', value: '周六'},
				    {text: '周日', value: '周日'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{	*/
				
				
			},{
				xtype: 'sliderfield',
				label: '星期',
				labelWidth: 60,
				//labelAlign: 'left',
				name: 'weekday',
				value: 1,
				minValue: 1,
				maxValue: 7,
				increment: 1,
				listeners: {
					change: function( field, sl, thumb, newValue ){
						console.log(newValue)
						field.up('panel').onTime(newValue,'hr','min')
						field.up('panel').down('sliderfield[name=hr]').setDisabled(false)
						field.up('panel').down('sliderfield[name=min]').setDisabled(false)
					}
				}
			},{
				xtype: 'sliderfield',
				label: '时［08-20］',
				labelAlign: 'top',
				name: 'hr',
				value: 8,
				minValue: 8,
				maxValue: 20,
				increment: 1,
				//disabled: true,
				listeners: {
					change: function( field, sl, thumb, newValue ){
						console.log(newValue)
						field.up('panel').onTime('weekday',newValue,'min')
						//field.up('panel').down('sliderfield[name=min]').setDisabled(false)
					}
				}	
			},{
				xtype: 'sliderfield',
				label: '分［05-55］',
				labelAlign: 'top',
				name: 'min',
				value: 0,
				minValue: 0,
				maxValue: 55,
				increment: 5,
				//disabled: true,
				listeners: {
					change: function( field, sl, thumb, newValue ){
						console.log(newValue)
						field.up('panel').onTime('weekday','hr',newValue)
					}
				}
					/*
			},{
				xtype: 'timepickerfield',
				label: '开始时间',	
				name: 'begintime', 
				
			},{
				xtype: 'selectfield',
				name: 'begintime', 
				label: '开始时间',
				options: [
				    {text: '08:00', value: '08:00'},
				    {text: '08:30', value: '08:30'},
				    {text: '09:00', value: '09:00'},
				    {text: '09:30', value: '09:30'},
				    {text: '10:00', value: '10:00'},
				    {text: '10:30', value: '10:30'},
				    {text: '11:00', value: '11:00'},
				    {text: '13:00', value: '13:00'},
				    {text: '13:30', value: '13:30'},
				    {text: '14:00', value: '14:00'},
				    {text: '14:30', value: '14:30'},
				    {text: '15:00', value: '15:00'},
				    {text: '15:30', value: '15:30'},
				    {text: '16:00', value: '15:00'},
					{text: '16:30', value: '16:30'},
				    {text: '17:00', value: '17:00'},
				    {text: '18:30', value: '18:30'},
				    {text: '19:00', value: '19:00'},
				    {text: '19:30', value: '19:30'},
				    {text: '20:00', value: '20:00'},
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				}, */
			}]	
		}],	
		
    	listeners: [{
			delegate: 'button[action=done]',
			event: 'tap',
			fn: 'onDone' 						
    	}]
	},
	
	onTime: function(weekday,hr,min){
		var me = this;
		var timely = me.down('label[name=timely]')
		if(weekday != 'weekday'){
			switch(weekday){
			case 1:
				weekday = '周一';break;
			case 2:
				weekday = '周二';break;	
			case 3:
				weekday = '周三';break;
			case 4:
				weekday = '周四';break;	
			case 5:
				weekday = '周五';break;
			case 6:
				weekday = '周六';break;	
			case 7:
				weekday = '周日';break;	
			}
			var time = timely.getHtml().substr(2)
			console.log(time)
			//if(time.length==0) time = '08:00'
			//var val = weekday + timely.getValue().substr(3)
			timely.setHtml(weekday+time)
		}
		if(hr != 'hr'){ //传递参数：时
			hr = hr.toString()
			hr = hr.length==1 ? '0'+hr : hr
			var val = timely.getHtml().substr(0,2) + hr + timely.getHtml().substr(4)
			timely.setHtml(val)
		}
		if(min != 'min'){
			min = min.toString()
			min = min.length==1 ? '0'+min : min
			var val = timely.getHtml().substr(0,5) + min
			timely.setHtml(val)
		}
		
	},

	onDone: function(btn){
		var me = this;
		var //weekday = me.down('selectfield[name=weekday]').getValue(),
			timely = me.down('label[name=timely]').getHtml()
			//begintime = me.down('timepickerfield[name=begintime]').getValue()
		if (timely == ''){
			Ext.toast('请滑动设置上课时间',3000); return;
		}
		/*
		if (begintime == null){
			Ext.toast('请选择时间',3000); return;
		} */
		
		var obj = {
			//weekday: weekday,
			//begintime: begintime,
			"timely": timely
		}
		console.log(obj)
		me.fireEvent('done',obj,me.getParentView(),me);
		me.destroy()
	},
});