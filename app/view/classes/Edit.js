Ext.define('Youngshine.view.classes.Edit', {
    extend: 'Ext.form.Panel',
    xtype: 'classes-edit',

    config: {
		record: null,
		layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '修改大小班',
			items: [{
				text: '取消',
				ui: 'decline',
				action: 'cancel'
			},{
				xtype: 'spacer'
			},{
				ui: 'confirm',
				text: '保存',
				//disabled: true,// 微信企业号才能新增，修改 by 执行校长
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
				name: 'title', //绑定后台数据字段
				label: '名称',
				clearIcon: false
			},{
				xtype: 'selectfield',
				label: '所属课程', //选择后本地缓存，方便下次直接获取
				name: 'kclistID',
				//store: 'Kclist', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'kclistID',
				displayField: 'title',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'datepickerfield',
				name: 'beginDate', //绑定后台数据字段
				label: '开课日期',
			},{	
				xtype: 'numberfield',
				name: 'persons',
				label: '预招人数',	
			},{
				xtype: 'selectfield',
				label: '教师', //选择后本地缓存，方便下次直接获取
				name: 'teacherID',
				//store: 'Teacher', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'teacherID',
				displayField: 'teacherName',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
			},{
				xtype: 'hiddenfield',
				name: 'classID' //修改的unique			
			}]	
		
    	},{
			xtype: 'button',
			text : '＋上课周期',
			ui : 'plain',
			action: 'timely', //大小班课程，不是班级
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
				'<div><span>{timely}</span>'+
				'<span class="removeItem" style="float:right;color:red;">&nbsp;&nbsp;删除</span>'
	        ],	
			store: Ext.create("Ext.data.Store", {
				fields: [
		            {name: "timely", type: "string"},
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
			delegate: 'button[action=timely]',
			event: 'tap',
			fn: 'onTimely'	
		},{
			delegate: 'list',
			event: 'itemtap',
			fn: 'onItemtap'	
		}]
	},

	onSave: function(){
		//window.scrollTo(0,0);
		var me = this;
		
		var classID = this.down('hiddenfield[name=classID]').getValue(), //unique
			title = this.down('textfield[name=title]').getValue().trim(),
			//kclistID = this.down('hiddenfield[name=kclistID]').getValue(),
			//kclistTitle = this.down('textfield[name=kclistTitle]').getValue(),
			kclistID = this.down('selectfield[name=kclistID]').getValue(),
			persons = this.down('numberfield[name=persons]').getValue(),
			beginDate = this.down('datepickerfield[name=beginDate]').getFormattedValue("Y-m-d"),
			teacherID = this.down('selectfield[name=teacherID]').getValue()
		
		if(teacherID == null) teacherID=0; //尚未确定教师
		
		if (title == ''){
			Ext.toast('班级名称不能空白',3000); return;
		}
		if (kclistID == 0 || kclistID == null ){
			Ext.toast('请选择所属课程',3000); return;
		}
		
		var arrList = [] //jsonList = {};
		var store = me.down('list').getStore()
		store.each(function(rec,index){
			arrList.push(rec.data.timely)
			//jsonList[index] = rec.data.kclistID 
		})
		//if (store.getCount()==0){
		if (arrList.length == 0){	
			Ext.toast('请添加上课周期时间',3000); return;
		}
		console.log(arrList);
		//arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		arrList = arrList.join(',')
		console.log(arrList)
		
		var obj = {
			title: title,
			kclistID: kclistID,
			//kclistTitle: kclistTitle,
			beginDate: beginDate,
			persons: persons,
			teacherID: teacherID,
			timely_list: arrList,
			classID: classID // unique
		};
		console.log(obj)

    	Ext.Msg.confirm('保存',"确认修改保存？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', obj,me);
			}
		});	

		// 前端显示更新
		me.getRecord().set(obj)
		//me.getRecord().set('teacherName',teacher)
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	},
	
	// 每周可能不止上课一次
	onTimely: function(btn){
		this.fireEvent('timely',btn,this);
	},
	
	// 移除报读的班级
	onItemtap: function(list, index, target, record, e, eOpts){
		var me = this;
		console.log(e.target.className)
		if(e.target.className == 'removeItem'){
			list.getStore().removeAt(index)
		}
	},
});
