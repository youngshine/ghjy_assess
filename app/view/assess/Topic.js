/**
 * Displays a list of 测评题目
 */
Ext.define('Youngshine.view.assess.Topic', {
    extend: 'Ext.dataview.List',
	xtype: 'assess-topic',
	
    config: {
		parentRecord: null,
		
		store: 'Topic',
        //itemHeight: 89,
		//disableSelection: true,
		striped: true,
        itemTpl: [
			'<div>{content}</div>' +
			'<div style="color:#888;font-size:0.8em;">'+
			'<span>{zsdName}</span>'+
			'<span class="answer" style="float:right;color:green;">答案</span>'+
			'</div>'			
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '测评题目记录',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				handler: function(){
					this.up('list').onBack()
				}
			},{
				xtype: 'spacer'
			},{
				ui : 'action',
				text: '测评报告',
				//action: 'addnew',
				//iconCls: 'add',
				handler: function(){
					this.up('list').onReport()
				}		
			}]
		},{
    		xtype: 'label',
			scrollDock: 'top',
			docked: 'top',
			html: '<span class="addnew">＋添加题目</span>'+
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<span class="hist">历年考点雷达图</span>',
			//itemId: 'zsd',
			style: 'text-align:center;color:green;margin:10px;'
    	}],	
		
		listeners: [{
			element: 'element',
			delegate: 'span.addnew',
			event: 'tap',
			fn: 'onAddnew'
		},{
			element: 'element',
			delegate: 'span.hist',
			event: 'tap',
			fn: 'onHistChart'	
		}],
    },
	
    onAddnew: function(btn){
		var me = this; console.log(me.getParentRecord())
		var obj = {
			subjectID: me.getParentRecord().data.subjectID,
			gradeID: me.getParentRecord().data.gradeID,
			semester: me.getParentRecord().data.semester,
			assessID: me.getParentRecord().data.assessID,
			schoolID: localStorage.schoolID
		} 
		console.log(obj)
		me.fireEvent('addnew',obj, me);
    },
    onBack: function(btn){
		var me = this;
		me.fireEvent('back', me);
    },
	
	onHistChart: function(){
		var me = this;

		var obj = {
			subjectID: me.getParentRecord().data.subjectID,
			gradeID: me.getParentRecord().data.gradeID,
			semester: me.getParentRecord().data.semester,
			schoolID: localStorage.schoolID
		} 
		console.log(obj);
		me.fireEvent('hist',obj, me);
	},	
	onReport: function(){
		var me = this; 
		if(me.getStore().getCount()==0){
			Ext.toast('尚无测评内容',3000)
			return false
		}	
			
		var obj = {
			subjectID: me.getParentRecord().data.subjectID,
			gradeID: me.getParentRecord().data.gradeID,
			semester: me.getParentRecord().data.semester,
			schoolID: localStorage.schoolID,
			studentName: me.getParentRecord().data.studentName,
			subjectName: me.getParentRecord().data.subjectName,
			gradeName: me.getParentRecord().data.gradeName
		} 
		console.log(obj);
		me.fireEvent('report',obj, me);	
	}
});
