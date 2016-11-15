// 退费退班，大小班、一对一课程
Ext.define('Youngshine.view.accnt.AddnewRefund', {
    extend: 'Ext.form.Panel',
    xtype: 'accnt-addnew', //与一对一相同xtype

    config: {
		layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '退费退班',
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
				labelWidth: 95,
				xtype: 'textfield'
			},
			items: [{
				xtype: 'selectfield',
				name: 'accntType', 
				label: '课程类型',
				options: [
				    {text: '大小班', value: '大小班'},
				    {text: '一对一', value: '一对一'},
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
				listeners: {
					change: function(e){
						//this.setDisabled(true)
						this.up('formpanel').down('button[action=kclist]').setDisabled(false)
					}
				}
			},{	
				layout: 'hbox',
				xtype: 'container',
				//itemId: 'student',
				items: [{
					xtype: 'textfield',
					name: 'studentName', 
					label: '姓名',
					labelWidth: 95,
					placeHolder: '选择全校范围学生',
					readOnly: true, //to focus
					flex: 1
				},{
					xtype: 'button',
					action: 'student',
					text: '...',
					//iconCls: 'delete',
					ui: 'plain',
					width: 50,
					//zIndex: 999
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
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '退费金额',
			},{
				xtype: 'selectfield',
				name: 'payment', 
				label: '付款方式',
				options: [
				    {text: '现金', value: '现金'},
				    {text: '刷卡', value: '刷卡'},
				    {text: '微信', value: '微信'},
				    {text: '支付宝', value: '支付宝'}
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
						// form滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			}]
    	},{
			xtype: 'button',
			text : '＋退费课程明细',
			ui : 'plain',
			action: 'kclist', //1to1
			disabled: true,
			style: {
				color: 'SteelBlue',
				background: 'none',//'#66cc00',
				margin: '-10px 100px 0px',
				border: 0
			},
			bageText: '0'
		},{
			// 缴费购买课程项目明细 1、一对一 2、大小班
			xtype: 'list',
			margin: '10px',
			//height: '100%',
			//ui: 'round',
			flex: 1,
			disableSelection: true,
	        itemTpl: [
				'<div><span>{title}</span>'+
				'<span class="removeItem" style="float:right;color:red;">&nbsp;&nbsp;删除</span>'+
				'<span style="color:#888;float:right;">{hour}课时{amount}元</span></div>'
	        ],	
			store: Ext.create("Ext.data.Store", {
				fields: [
		            {name: "title", type: "string"},
					{name: "kclistID", defaultValue: 0}, //0， 不是大小班
					{name: "unitprice"},
					{name: "hour"},
					{name: "amount"},
					{name: "accntdetailID"}, //退费，退班用
					{name: "kcType"},
		        ],
			}),
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
			fn: 'onStudent'	
		},{
			delegate: 'button[action=kclist]',
			event: 'tap',
			fn: 'onKclist'
		},{
			delegate: 'list',
			event: 'itemtap',
			fn: 'onItemtap'
		}]
	},

	// 课程退费保存，如果是大小班课程，还必须退班（根据accntdetailID在class_student)
	onSave: function(){
		var me = this;
		
		// 页面恢复正常
		me.getScrollable().getScroller().scrollTo(0,0);
		window.scrollTo(0,0);

		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue(),
			wxID = this.down('hiddenfield[name=wxID]').getValue(), // wechat
			accntDate = this.down('datepickerfield[name=accntDate]').getFormattedValue("Y-m-d"),
			amount = this.down('numberfield[name=amount]').getValue(),
			payment = this.down('selectfield[name=payment]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim()
	
		if (studentName == ''){
			Ext.toast('请选择学生',3000); return;
		}
		if (amount == 0 || amount==null){
			Ext.toast('请填写退费金额',3000); return;
		}	
			
		//if list.length == 0 '至少报读一个班级'
		var arrList = [],
			jsonList = {};
		var store = me.down('list').getStore()
		store.each(function(rec,index){
			arrList.push(rec.data)
			//jsonList[index] = rec.data.pricelistID 
		})
		//if (store.getCount()==0){
		if (arrList.length == 0){	
			Ext.toast('请添加明细记录',3000); return;
		}
		
		//console.log(JSON.stringify(jsonList));
		arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		console.log(arrList);
		
		var obj = {
			accntType: '退费退班',
			studentName: studentName,
			studentID: studentID,
			wxID: wxID, //用于发送微信模版消息
			accntDate: accntDate,
			amount: amount,
			amount_ys: 0, //退费没有应收款
			payment: payment,
			note: note,
			arrList: arrList, // 报读的多个大小班课程
			consultID: localStorage.consultID,//归属哪个咨询师
			schoolsubID: localStorage.schoolsubID,//归属哪个分校统计，咨询师可能换校区
			schoolID: localStorage.schoolID 
		};
		console.log(obj)
		
    	Ext.Msg.confirm('保存',"确认提交退费？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', obj,me);
				// 然后在class-student 填写班级学生
			}
		})	
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	},
	
	// 移除报读的班级
	onItemtap: function(list, index, target, record, e, eOpts){
		var me = this;
		console.log(e.target.className)
		if(e.target.className == 'removeItem'){
			list.getStore().removeAt(index)
			var ss = me.down('textfield[name=amount]')
			// 金额 减少
			var amt = parseInt(record.data.amount)
			ss.setValue(ss.getValue()-amt)
		}
	},
	
	// 查找选择学生
	onStudent: function(btn){
		var me = this; 
		me.fireEvent('student',btn,me);
	},
	
	// 添加课程明细记录，退费必须是从前购买的
	onKclist: function(btn){
		var me = this;
		var studentName = this.down('textfield[name=studentName]').getValue().trim()
		if (studentName == ''){
			Ext.toast('请选择学生',3000); return;
		}
		var studentID = this.down('hiddenfield[name=studentID]').getValue()
		me.down('button[action=student]').setDisabled(true)	
		me.down('textfield[name=studentName]').setDisabled(true)
		
		var sel = this.down('selectfield[name=accntType]')
		sel.setDisabled(true);
		var accntType = sel.getValue()
		
		var obj = {
			studentID: studentID,
			accntType: accntType
		}
		
		this.fireEvent('kclistRefund',obj,btn,this);
	},
});
