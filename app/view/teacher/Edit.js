Ext.define('Youngshine.view.teacher.Edit', {
    extend: 'Ext.form.Panel',
    xtype: 'teacher-edit',

    config: {
		record: null,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '修改教师资料',
			items: [{
				text: '取消',
				ui: 'decline',
				action: 'cancel'
			},{
				xtype: 'spacer'
			},{
				ui: 'confirm',
				text: '保存',
				disabled: true,// 微信企业号才能新增，修改 by 执行校长
				action: 'save'
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
				name: 'teacherName', //绑定后台数据字段
				label: '姓名',
				disabled: true,
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
				name: 'subjectID', 
				label: '学科',
				disabled: true,
				options: [
				    {text: '数学', value: 1},
				    {text: '物理', value: 2},
				    {text: '化学', value: 3}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
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
				xtype: 'hiddenfield',
				name: 'teacherID' //修改的unique			
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

	onSave: function(){
		//window.scrollTo(0,0);
		var me = this;
		
		var teacherID = this.down('hiddenfield[name=teacherID]').getValue(),
			teacherName = this.down('textfield[name=teacherName]').getValue().trim(),
			gender = this.down('selectfield[name=gender]').getValue(),
			subjectID = this.down('selectfield[name=subjectID]').getValue(),
			phone = this.down('textfield[name=phone]').getValue().trim(),
			note = this.down('textfield[name=note]').getValue().trim()
	
		if (teacherName == ''){
			Ext.toast('姓名不能空白',3000); return;
		}
		if (phone == ''){
			Ext.toast('电话不能空白',3000); return;
		}
		var obj = {
			teacherName: teacherName,
			gender: gender,
			subjectID: subjectID,
			phone: phone,
			note: note,
			teacherID: teacherID //修改
		};
		console.log(obj)
		me.fireEvent('save', obj,me);
		// 前端显示更新
		me.getRecord().set('teacherName',teacherName)
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	}
	
});
