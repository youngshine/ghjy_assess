Ext.define('Youngshine.view.accnt.Addnew_1to1', {
    extend: 'Ext.form.Panel',
    xtype: 'accnt-addnew',//与大小班相同xtype

    config: {
		//layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '购买一对一课程',
			items: [{
				text: '取消',
				ui: 'decline',
				action: 'cancel'
			},{
				xtype: 'spacer'
			},{
				ui: 'confirm',
				text: '保存',
				action: 'save'
			}]
		},{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 95
			},
			items: [{
				layout: 'hbox',
				xtype: 'container',
				items: [{
					xtype: 'textfield',
					name: 'studentName', 
					label: '姓名',
					labelWidth: 95,
					placeHolder: '选择学生',
					readOnly: true, //to focus
					flex: 1
				},{
					xtype: 'button',
					action: 'student',
					text: '...',
					//iconCls: 'search',
					ui: 'plain',
					width: 60,
					zIndex: 999
				},{	
					xtype: 'hiddenfield',
					name: 'studentID', //绑定后台数据字段
				},{	
					xtype: 'hiddenfield',
					name: 'wxID', //用于发模版消息
				}]
			},{
				xtype: 'datepickerfield',
				name: 'accntDate', 
				label: '日期',
				value: new Date()	
			},{
				xtype: 'selectfield',
				label: '课程名称', //选择后本地缓存，方便下次直接获取
				name: 'pricelistID',
				store: 'Pricelist', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'pricelistID',
				displayField: 'title',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{	
				xtype: 'numberfield',
				name: 'unitprice', 
				label: '单价',
				readOnly: true
			},{	
				xtype: 'numberfield',
				name: 'hour', //绑定后台数据字段
				label: '课时数',
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			},{	
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '实收（元）',
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			},{	
				xtype: 'numberfield',
				name: 'amount_ys', //绑定后台数据字段
				label: '应收金额',
				//clearIcon: false, 
				value: 0,
				readOnly: true
			},{
				xtype: 'selectfield',
				name: 'payment', 
				label: '付款方式',
				options: [
				    {text: '现金', value: '现金'},
				    {text: '刷卡', value: '刷卡'},
				    {text: '微信', value: '微信'},
				    {text: '扫码', value: '扫码'}
				],
				autoSelect: true, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{	
				xtype: 'textfield',
				name: 'note', 
				label: '备注', //为什么优惠？
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}	
						
			},{
				xtype: 'hiddenfield',
				name: 'title', // 一对一课时套餐名称，用于保存	
			}]
		}],		
	
		listeners: [{
			delegate: 'button[action=save]',
			event: 'tap',
			fn: 'onSave'
		},{
			delegate: 'button[action=cancel]',
			event: 'tap',
			fn: 'onCancel'	
		},{
			delegate: 'button[action=student]',
			event: 'tap',
			fn: 'onStudent'	/*
		},{
			delegate: 'button[action=pricelist]',
			event: 'tap',
			fn: 'onPricelist' */
		},{
			delegate: 'textfield[name=hour]',
			event: 'change',
			fn: 'onHour'	
		},{
			delegate: 'selectfield[name=pricelistID]',
			event: 'change',
			fn: 'onPricelistChange'	
		}]
	},

	onSave: function(){
		var me = this;
		
		// 页面回复正常
		me.getScrollable().getScroller().scrollTo(0,0);
		window.scrollTo(0,0);

		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue(),
			wxID = this.down('hiddenfield[name=wxID]').getValue(), // wechat
			accntDate = this.down('datepickerfield[name=accntDate]').getFormattedValue("Y-m-d"),
			title = this.down('hiddenfield[name=title]').getValue(), //一对一课程名称
			unitprice = this.down('numberfield[name=unitprice]').getValue(),
			hour = this.down('numberfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue(),
			amount_ys = this.down('numberfield[name=amount_ys]').getValue(),
			payment = this.down('selectfield[name=payment]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim(),
			pricelistID = this.down('selectfield[name=pricelistID]').getValue()
	
		if (studentName == ''){
			Ext.toast('姓名不能空白',3000); return;
		}
		if (pricelistID == null){
			Ext.toast('请选择课时套餐',3000); return;
		}
		if (amount == 0 ){
			Ext.toast('请填写金额',3000); return;
		}
		var obj = {
			accntType: '一对一',
			studentName: studentName,
			studentID: studentID,
			wxID: wxID, //发模版消息
			accntDate: accntDate,
			//taocan: taocan,
			amount: amount,
			amount_ys: amount_ys,
			payment: payment,
			note: note,
			pricelistID: pricelistID, // 1to1
			title: title,
			unitprice: unitprice,
			hour: hour,
			consultID: localStorage.consultID,
			//schoolID: localStorage.schoolID //归属哪个咨询师
		};
		console.log(obj)
		
    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', obj,me);
			}
		})
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	},

	// 选择套餐，自动金额
	onPricelistChange: function(sel, newValue, oldValue, eOpts){
		var me = this; 
		var store = sel.getStore();
		store.each(function(record){
			if(record.data.pricelistID == newValue ){
				//me.down('numberfield[name=amount_ys]').setValue(record.data.amount)
				//me.down('numberfield[name=amount]').setValue(record.data.amount)
				me.down('hiddenfield[name=title]').setValue(record.data.title)
				me.down('numberfield[name=unitprice]').setValue(record.data.unitprice)
				
				var hour = me.down('numberfield[name=hour]').getValue()
				me.down('numberfield[name=amount_ys]').setValue(record.data.unitprice * hour)
				me.down('numberfield[name=amount]').setValue(record.data.unitprice * hour)
				return false
			}
			console.log(record.data)
		})
	},
	onHour: function( field, newValue, oldValue, eOpts ){
		var me = this;
		var up = me.down('numberfield[name=unitprice]').getValue()
		me.down('numberfield[name=amount_ys]').setValue(newValue * up)
		me.down('numberfield[name=amount]').setValue(newValue * up)
	},
	
	// 查找选择学生
	onStudent: function(btn){
		var me = this; 
		me.fireEvent('student',btn,me);
	},
	/* 价格表
	onPricelist: function(btn){
		var me = this; 
		me.fireEvent('pricelist',btn,me);
	} */
	// 滚动自己，避免toolbar滚动
	//this.up('drive-new').getScrollable().getScroller().scrollTo(0,360);
	//window.scrollTo(0,0);
});
