Ext.define('Youngshine.view.classes.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'classes-addnew',

    config: {
		layout: 'vbox',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增班级',
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
				name: 'title', //绑定后台数据字段
				label: '名称',
				//placeHolder: '格式：2016年秋季奥数班',
				clearIcon: false
			},{
				layout: 'hbox',
				xtype: 'container',
				items: [{
					xtype: 'textfield',
					name: 'kclistTitle', 
					label: '所属课程',
					labelWidth: 85,
					placeHolder: '选择课程',
					readOnly: true, //to focus
					flex: 1
				},{
					xtype: 'button',
					action: 'kclist',
					text: '...',
					//iconCls: 'search',
					ui: 'plain',
					width: 60,
					zIndex: 999
				},{	
					xtype: 'hiddenfield',
					name: 'kclistID', //绑定后台数据字段
				}]
			},{
				xtype: 'datepickerfield',
				name: 'beginDate', //绑定后台数据字段
				label: '开课日期',
				value: new Date()
			},{	
				xtype: 'numberfield',
				name: 'persons', //绑定后台数据字段
				label: '预招人数',
				clearIcon: false,
			},{
				xtype: 'selectfield',
				label: '教师', //选择后本地缓存，方便下次直接获取
				name: 'teacherID',
				store: 'Teacher', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'teacherID',
				displayField: 'teacherName',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
			},{
				xtype: 'selectfield',
				label: '教师主管', //选择后本地缓存，方便下次直接获取
				name: 'teacherchiefID',
				store: 'Teacher', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'teacherID',
				displayField: 'teacherName',
				disabled: true,
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},		
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
			delegate: 'button[action=kclist]',
			event: 'tap',
			fn: 'onKclist'
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
		
		var title = this.down('textfield[name=title]').getValue().trim(),
			kclistID = this.down('hiddenfield[name=kclistID]').getValue(),
			kclistTitle = this.down('textfield[name=kclistTitle]').getValue(),
			persons = this.down('numberfield[name=persons]').getValue(),
			beginDate = this.down('datepickerfield[name=beginDate]').getFormattedValue("Y-m-d"),
			teacherID = this.down('selectfield[name=teacherID]').getValue()

		console.log(kclistID,kclistTitle)
		if(teacherID == null) teacherID=0; //尚未确定教师
			
		if (title == ''){
			Ext.toast('班级名称不能空白',3000); return;
		}
		if (kclistID == 0 || kclistID == null ){
			Ext.toast('请选择所属课程',3000); return;
		}

		//if list.length == 0 '至少报读一个班级'
		var arrList = [] //jsonList = {};
		var store = me.down('list').getStore()
		store.each(function(rec,index){
			arrList.push(rec.data.timely)
			//jsonList[index] = rec.data.kclistID 
		})
		//if (store.getCount()==0){
		if (arrList.length == 0){	
			Ext.toast('请添加上课时间',3000); return;
		}
		console.log(arrList);
		//arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		arrList = arrList.join(',')
		console.log(arrList)
		
    	Ext.Msg.confirm('保存',"确认新增保存？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					title: title,
					kclistID: kclistID,
					kclistTitle: kclistTitle,
					beginDate: beginDate,
					persons: persons,
					teacherID: teacherID,
					timely_list: arrList,
					schoolsubID: localStorage.schoolsubID, //班级具体到分校区
					consultID: localStorage.consultID //咨询师自己创建的才能修改
				};
				console.log(obj)
				me.fireEvent('save', obj,me);
			}
		});	
	},
	onCancel: function(btn){
		this.fireEvent('cancel',this);
		//this.destroy()
	},
	
	// 查找选择对应大小班课程
	onKclist: function(btn){
		var me = this; 
		me.fireEvent('kclistClass',btn,me);
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
