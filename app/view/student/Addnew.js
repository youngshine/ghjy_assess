Ext.define('Youngshine.view.student.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'student-addnew',

    config: {
 
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增学生',
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
				labelWidth: 85,
				xtype: 'textfield'
			},
			//title: '个人资料',
			items: [{
				xtype: 'textfield',
				name: 'studentName', //绑定后台数据字段
				label: '姓名',
				clearIcon: false
			},{
				xtype: 'selectfield',
				name: 'gender', 
				autoSelect: false,
				label: '性别',
				options: [
				    {text: '男', value: '男'},
				    {text: '女', value: '女'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
			},{
				xtype: 'selectfield',
				name: 'grade', 
				label: '年级',
				options: [
				    {text: '高三年', value: '高三年'},
				    {text: '高二年', value: '高二年'},
				    {text: '高一年', value: '高一年'},
				    {text: '九年级', value: '九年级'},
				    {text: '八年级', value: '八年级'},
				    {text: '七年级', value: '七年级'},
				    {text: '六年级', value: '六年级'},
				    {text: '五年级', value: '五年级'},
				    {text: '四年级', value: '四年级'},
				    {text: '三年级', value: '三年级'},
				    {text: '二年级', value: '二年级'},
				    {text: '一年级', value: '一年级'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{	
				xtype: 'textfield',
				name: 'addr', //绑定后台数据字段
				label: '地址',
				clearIcon: false,
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			},{	
				xtype: 'textfield',
				name: 'phone', //绑定后台数据字段
				label: '电话',
				clearIcon: false,
				component: { // 显示数字键
					xtype: 'input',
					type: 'tel'
				},
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}	
			},{	
				xtype: 'textfield',
				name: 'note', //绑定后台数据字段
				label: '备注',
				clearIcon: false,
				listeners: {
					focus: function(e){
						// 滚动自己，避免toolbar滚动，前面2个 2*50=100
						this.up('panel').getScrollable().getScroller().scrollTo(0,100);
						window.scrollTo(0,0);
					}
				}
			},{
				xtype: 'selectfield',
				name: 'schoolsubID', 
				label: '分校区',
				store: 'Schoolsub',
				valueField: 'schoolsubID',
				displayField: 'fullname',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
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
		}]
	},

	/* it's bad to use listeners config obj in Ext.define(), use it in instanialiing create()
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
    }, */

	onSave: function(){
		// 页面回复正常
		this.getScrollable().getScroller().scrollTo(0,0);
		window.scrollTo(0,0);
		
		var me = this;
		
		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			gender = this.down('selectfield[name=gender]').getValue(),
			grade = this.down('selectfield[name=grade]').getValue(),
			phone = this.down('textfield[name=phone]').getValue().trim(),
			addr = this.down('textfield[name=addr]').getValue().trim(),
			note = this.down('textfield[name=note]').getValue().trim(),
			schoolsubID = this.down('selectfield[name=schoolsubID]').getValue()
	
		if (studentName == ''){
			Ext.toast('请填写姓名',3000); return;
		}
		if (gender == null){
			Ext.toast('请选择性别',3000); return;
		}
		if (grade == null){
			Ext.toast('请选择年级',3000); return;
		}
		if (phone == ''){
			Ext.toast('电话不能空白',3000); return;
		}
		if (schoolsubID == null){
			Ext.toast('请选择学生报读分校区',3000); return;
		}
		var obj = {
			studentName: studentName,
			gender: gender,
			grade: grade,
			phone: phone,
			addr: addr,
			note: note,
			schoolsubID: schoolsubID, //归属学校的分校区
			consultID: localStorage.consultID,//归属哪个咨询师
			schoolID: localStorage.schoolID //归属学校
		};
		console.log(obj)
		
    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', obj,me);
			}
		});	
	},
	
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	}
	
});
