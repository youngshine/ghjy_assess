Ext.define('Youngshine.view.teacher.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'teacher-addnew',

    config: {
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增教师',
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
				labelWidth: 65,
				xtype: 'textfield'
			},
			//title: '个人资料',
			items: [{
				xtype: 'textfield',
				name: 'teacherName', //绑定后台数据字段
				label: '姓名',
				clearIcon: false
			},{
				xtype: 'selectfield',
				name: 'gender', 
				label: '性别',
				autoSelect: false,
				options: [
				    {text: '男', value: '男'},
				    {text: '女', value: '女'}
				]	
			},{
				xtype: 'selectfield',
				name: 'subject', 
				label: '学科',
				autoSelect: false,
				options: [
				    {text: '数学', value: 1},
				    {text: '物理', value: 2},
				    {text: '化学', value: 3}
				]
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
		var me = this;

		var teacherName = this.down('textfield[name=teacherName]').getValue().trim(),
			gender = this.down('selectfield[name=gender]').getValue(),
			phone = this.down('textfield[name=phone]').getValue().trim(),
			note = this.down('textfield[name=note]').getValue().trim(),
			subjectID = this.down('selectfield[name=subject]').getValue(),
			schoolID = localStorage.schoolID //教师归属哪个学校

		if (teacherName == ''){
			Ext.toast('姓名不能空白',3000); return;
		}
		if (phone == ''){
			Ext.toast('请填写电话',3000); return;
		}
		if (gender == null){
			Ext.toast('请选择教师性别',3000); return;
		}
		if (subjectID == null){
			Ext.toast('请选择学科',3000); return;
		}
		var obj = {
			teacherName: teacherName,
			gender: gender,
			subjectID: subjectID,
			phone: phone,
			note: note,
			schoolID: schoolID 
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
