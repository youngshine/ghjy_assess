Ext.define('Youngshine.view.accnt.AddnewKclistClass', {
    extend: 'Ext.form.Panel',
    xtype: 'accnt-addnew', //与一对一相同xtype

    config: {
		layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '购买大小班课程',
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
				layout: 'hbox',
				xtype: 'container',
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
					//iconCls: 'search',
					ui: 'plain',
					width: 50,
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
				xtype: 'numberfield',
				name: 'amount_ys', //绑定后台数据字段
				label: '应收金额',
				//clearIcon: false, 
				value: 0,
				readOnly: true
			},{	
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '实收(元)',
				listeners: {
					focus: function(e){
						// form滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			},{	
				xtype: 'numberfield',
				name: 'amount_owe', 
				label: '欠费',
				listeners: {
					focus: function(e){
						// form滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
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
			},{
				xtype: 'selectfield',
				label: '业绩归属', 
				name: 'consultID_owe', //默认归属录入咨询师
				//store: 'Consult', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'consultID',
				displayField: 'consultName',
				//disabled: true,
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			}]
    	},{
			xtype: 'button',
			text : '＋课程明细',
			ui : 'plain',
			action: 'kclist', //大小班课程，不是班级
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
		            //{name: "pricelistID", defaultValue: 0}, // 0,不是一对一
					{name: "unitprice", defaultValue: 0},
		            {name: "kclistID"},
					{name: "hour"},
					{name: "amount"},
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

	onSave: function(){
		var me = this;
		
		// 页面回复正常
		me.getScrollable().getScroller().scrollTo(0,0);
		window.scrollTo(0,0);

		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue(),
			wxID = this.down('hiddenfield[name=wxID]').getValue(), // wechat
			accntDate = this.down('datepickerfield[name=accntDate]').getFormattedValue("Y-m-d"),
			//taocan = this.down('textfield[name=taocan]').getValue(),
			//hour = this.down('hiddenfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue(),
			amount_ys = this.down('numberfield[name=amount_ys]').getValue(),
			amount_owe = this.down('numberfield[name=amount_owe]').getValue(),
			consultID_owe = this.down('selectfield[name=consultID_owe]').getValue(),
			payment = this.down('selectfield[name=payment]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim()
			//pricelistID = 0 //大小班，不是一对一课程pricelist
	
		if (studentName == ''){
			Ext.toast('请选择学生',3000); return;
		}
		if (amount == 0 ){
			Ext.toast('请填写实收金额',3000); return;
		}	
			
		//if list.length == 0 '至少报读一个班级'
		var arrList = [],
			jsonList = {};
		var store = me.down('list').getStore()
		store.each(function(rec,index){
			arrList.push(rec.data)
			jsonList[index] = rec.data.kclistID 
		})
		//if (store.getCount()==0){
		if (arrList.length == 0){	
			Ext.toast('请添加明细记录',3000); return;
		}
		//console.log(arrList);
		console.log(JSON.stringify(jsonList));
		//arrList = JSON.stringify(jsonList); 
		arrList = JSON.stringify(arrList); //传递到后台，必须字符串
	
		var obj = {
			accntType: '大小班',
			studentName: studentName,
			studentID: studentID,
			wxID: wxID, //用于发送微信模版消息
			accntDate: accntDate,
			amount: amount,
			amount_ys: amount_ys,
			amount_owe: amount_owe, //业绩归属
			consultID_owe: consultID_owe,
			payment: payment,
			note: note,
			//pricelistID: 0, //大小班，不是一对一
			//title: '',
			//unitprice: 0,
			//hour: 0, // 一对一课时
			arrList: arrList, // 报读的多个大小班课程
			consultID: localStorage.consultID,
			schoolsubID: localStorage.schoolsubID,//归属哪个分校统计，咨询师可能换校区
			schoolID: localStorage.schoolID 
		};
		console.log(obj)
		
    	Ext.Msg.confirm('保存',"确认提交购买？",function(btn){	
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
			var ys = me.down('textfield[name=amount_ys]'),
				ss = me.down('textfield[name=amount]')
			// 金额 减少
			var amt = parseInt(record.data.amount)
			ys.setValue(ys.getValue()-amt)
			ss.setValue(ss.getValue()-amt)
		}
	},
	
	// 查找选择学生
	onStudent: function(btn){
		var me = this; 
		me.fireEvent('student',btn,me);
	},
	// 查找选择咨询师拥有的班级
	onKclist: function(btn){
		this.fireEvent('kclistClass',btn,this);
	},
	// 滚动自己，避免toolbar滚动
	//this.up('drive-new').getScrollable().getScroller().scrollTo(0,360);
	//window.scrollTo(0,0);
});
