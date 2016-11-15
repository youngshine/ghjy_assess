// 排课
Ext.define('Youngshine.view.orders.study.Kcb',{
	extend: 'Ext.form.Panel',
	xtype: 'study-kcb',

	config: {
		record: null,
		modal: true,
		hideOnMaskTap: true,
		centered: true,
		width: 420,height: 260,
		//scrollable: true,

        items: [{	
        	xtype: 'toolbar',
        	docked: 'top',
        	title: '一对一排课',
			items: [{
				text : '完成',
				ui: 'confirm',
				//disabled: true,
				action: 'done',
			}]
		},{
			xtype: 'fieldset',
			width: '95%',
			items: [{
				xtype: 'selectfield',
				label: '上课日', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teach_weekday',
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
			},{
				xtype: 'selectfield',
				label: '时间段', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teach_timespan',
				options: [
				    {text: '08-10', value: '08-10'},
				    {text: '10-12', value: '10-12'},
				    {text: '14-16', value: '14-16'},
				    {text: '16-18', value: '16-18'},
				    {text: '19-21', value: '19-21'},
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'selectfield',
				label: '任课教师', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teacherID',
				valueField: 'teacherID',
				displayField: 'teacherName',
				autoSelect: false,
				listeners: {
					focus: function(selectBox, e, eOpts ){
						var weekday = this.up('fieldset').down('selectfield[name=teach_weekday]').getValue(),
							timespan = this.up('fieldset').down('selectfield[name=teach_timespan]').getValue()
						if(weekday==null || timespan==null){
							return false
							//Ext.toast('先选择上课时间');return false
						}
						// ajax读取可用学科教师
						this.up('panel').onTeacher(weekday,timespan,selectBox)
					},
					change: function(e){
						// 激活保存提交按钮
						//this.up('panel').down('button[action=done]').setDisabled(false);
					}
				}
			},{
				xtype: 'textfield',
				label: '备注',
				labelWidth: 85,
				name: 'note',
				clearIcon: false
			}]	

		}],	
		
		listeners: [{
			delegate: 'button[action=done]',
			event: 'tap',
			fn: 'onDone'	
		}] 
	},
	
	onDone: function(btn){
		var me = this;
		var teacherID = me.down('selectfield[name=teacherID]').getValue(),
			weekday = me.down('selectfield[name=teach_weekday]').getValue(),
			timespan = me.down('selectfield[name=teach_timespan]').getValue(),
			note = me.down('textfield[name=note]').getValue(),
			studentstudyID = me.getRecord().data.studentstudyID

		if(teacherID==null || teacherID==0){
			Ext.toast('请选择任课教师',3000); return false
		} 
		
		var obj = {
			teacherID: teacherID,
			weekday: weekday,
			timespan: timespan,
			note: note,
			studentstudyID: studentstudyID
		}	
		console.log(obj)
		me.fireEvent('done',obj,me);	
	},
	// 某个时间段可用校区学科教师，作为select数据源setOptioms(array)
	onTeacher: function(weekday,timespan,selectBox){
		var me = this;
		var obj = {
			"weekday": weekday,
			"timespan": timespan,
			"subjectID": me.getRecord().data.subjectID,
			"schoolID": localStorage.schoolID
		}
		console.log(obj)
		
		Ext.data.JsonP.request({ 
            url: Youngshine.app.getApplication().dataUrl +  'readTeacherListByKcb.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result.data)
				selectBox.updateOptions(result.data)		
            }
		});
	},
	
	hide: function(){
		this.destroy()
	}
});