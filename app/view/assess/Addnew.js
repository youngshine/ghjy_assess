Ext.define('Youngshine.view.assess.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'assess-addnew',

    config: {
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增测评',
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
			items: [{
				layout: 'hbox',
				xtype: 'container',
				items: [{
					xtype: 'textfield',
					name: 'studentName', 
					label: '姓名',
					labelWidth: 85,
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
				}]
			},{
				xtype: 'selectfield',
				name: 'subjectID', 
				label: '测评学科',
				autoSelect: false,
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
				xtype: 'selectfield',
				name: 'gradeID', 
				label: '年级',
				options: [
				    {text: '九年级', value: 9},
				    {text: '八年级', value: 8},
				    {text: '七年级', value: 7},
				    {text: '六年级', value: 6},
				    {text: '五年级', value: 5},
				    {text: '四年级', value: 4},
				    {text: '三年级', value: 3},
				    {text: '二年级', value: 2},
				    {text: '一年级', value: 1}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'selectfield',
				name: 'semester', 
				label: '学期',
				autoSelect: false,
				options: [
				    {text: '上', value: '上'},
				    {text: '下', value: '下'}
				],
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
		},{
			delegate: 'button[action=student]',
			event: 'tap',
			fn: 'onStudent'	
		}]
	},

	onSave: function(){
		var me = this;

		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue(),
			subjectID = this.down('selectfield[name=subjectID]').getValue(),
			gradeID = this.down('selectfield[name=gradeID]').getValue(),
			semester = this.down('selectfield[name=semester]').getValue()
	
		if (studentName == ''){
			Ext.toast('姓名不能空白',3000); return;
		}
		if (subjectID == null){
			Ext.toast('请选择要测评的学科',3000); return;
		}
		if (gradeID == null){
			Ext.toast('请选择年级',3000); return;
		}
		if (semester == null){
			Ext.toast('请选择学期',3000); return;
		}
		var obj = {
			studentName: studentName,
			studentID: studentID,
			subjectID: subjectID,
			gradeID: gradeID,
			semester: semester,
			//consultID: localStorage.consultID //咨询师来自学生表student
		};
		console.log(obj)
		me.fireEvent('save', obj,me);
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	},
	
	// 查找选择学生
	onStudent: function(btn){
		var me = this; 
		me.fireEvent('student',btn,me);
	},
	// 滚动自己，避免toolbar滚动
	//this.up('drive-new').getScrollable().getScroller().scrollTo(0,360);
	//window.scrollTo(0,0);
});
