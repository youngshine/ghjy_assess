/**
 * Displays a list of 测评试卷题目
 */
Ext.define('Youngshine.view.student.assess.AssessTopic', {
    extend: 'Ext.dataview.List',
	xtype: 'assess-topic',

    //id: 'topicteachList',

    config: {
		parentRecord: null, //保存list选择的父表的学生记录信息
		parentSubject: null, //测评学科（年级、学期、科目）
		
        store: 'Topic',
        //itemHeight: 89,
        //emptyText: '空白',
		disableSelection: true,
		//striped: true,
		itemTpl: '<div>' + 
			'<div style="color:#888;">题目{gid}</div>' +
			'<div>{content}</div>' +
			'<div style="text-align:right;">答题：'+
			'<span style="color:green;">{myAnswer}</span></div>'+
			'</div>',
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '测评试卷',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				//iconCls: 'team',
				handler: function(btn){
					btn.up('list').onBack() //返回
				}
			},{
				xtype: 'spacer'
			},{
				text: '历年考点雷达图',
				//iconCls: 'trash',
				ui: 'action',
				action: 'zsdhist',	
			},{
				ui : 'confirm',
				action: 'save',
				text : '提交',
				//hidden: true, //开始不可见，有添加题目才显示？
				//iconCls: 'add',
				handler: function(btn){
					btn.up('list').onSave()
				}		
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'assessSubject',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		listeners: [{
			element: 'element',
			delegate: 'span.fetch',
			event: 'tap',
			fn: 'onFetch'
		},{
			element: 'element',
			delegate: 'span.photo',
			event: 'tap',
			fn: 'onPhoto'	
		},{
			delegate: 'button[action=zsdhist]',
			event: 'tap',
			fn: 'onZsdhist'
		}],
    },
	
	// setRecord lead to this，更新页面显示
	updateRecord: function(newRecord){
		var me = this;
		//alert(newRecord); // 有时控制器setrecord(record)，这个函数不运行？
		if(newRecord){
			console.log(newRecord.data);
			//this.down('panel[itemId=topicInfo]').setData(newRecord.data);
			//
			//var radioChecked = this.down('radiofield[value='+newRecord.data.done+']')
			//radioChecked.setChecked(true)
			
			// 评分后，不能删除
			//me.setBtnDelete(newRecord.data.done)
		}
	},	
	
	// 提交，结果导出成html保存？？？
	onSave: function(){
		var me = this;
		var store = me.getStore()
		console.log(store)
		
		var subject = me.down('label[itemId=assessSubject]').getHtml()
		var studentRecord = me.getParentRecord(); //学生信息
		var objSubject = me.getParentSubject(); //测评学科（年级、学期、科目）
/*		
    	Ext.Msg.confirm('询问',"确认提交测评？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', subject,me);
			}
		});	
*/
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '做完题目，生成测评报告？',
				ui: 'confirm',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					me.fireEvent('save', subject,studentRecord,objSubject);
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
	},
	
	// 历史考点雷达图
	onZsdhist: function(radio){
		var me = this
		var obj = {
			subjectID: me.getParentSubject().subjectID,
			gradeID: me.getParentSubject().gradeID,
			semester: me.getParentSubject().semester,
			schoolID: localStorage.schoolID, //忽略，都用泉州的
		} 
		console.log(obj);
		me.fireEvent('zsdhist',obj, me);
	},
	
	// 返回
	onBack: function(){
		this.fireEvent('back',this)
	},	
});
