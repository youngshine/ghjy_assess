/**
 * Displays a list of 测评试卷题目
 */
Ext.define('Youngshine.view.student.assess.AssessTopic', {
    extend: 'Ext.dataview.List',
	xtype: 'assess-topic',

    //id: 'topicteachList',

    config: {
		parentRecord: null, //保存list选择的父表的学生记录信息
		
        store: 'Topic',
        //itemHeight: 89,
        //emptyText: '空白',
		disableSelection: true,
		//striped: true,
		itemTpl: '<div>' + 
			'<div style="color:blue;">题目：{#}</div>' +
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
			itemId: 'assess-subject',
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
			element: 'element',
			delegate: 'span.pdf',
			event: 'tap',
			fn: 'onPDF'
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
		
		var subject = me.down('label[itemId=assess-subject]').getHtml()
		
    	Ext.Msg.confirm('询问',"确认提交测评？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', subject,me);
			}
		});	
		return
		
		for(var i=0;i<store.getCount();i++){
			if(store.getAt(i).get('done')==0){
				Ext.toast('当前题目未做完',3000); return false
			}
			done += parseInt( store.getAt(i).get('done') )
		}
	},
	
	// 返回
	onBack: function(){
		this.fireEvent('back',this)
	},	
});