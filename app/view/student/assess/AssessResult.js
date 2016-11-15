// 测评试卷的评分结果
Ext.define('Youngshine.view.student.assess.AssessResult',{
	extend: 'Ext.Container',
	xtype: 'assess-result',
	
	//requires: ['Ext.Img','Ext.ActionSheet'], 
	
	config: {
		parentRecord: null, //container保存数据记录setRecord
		scrollable: true,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '测评结果', // 根据不同类型Type而变化，在updateRecord
			items: [{
				text: '关闭',
				ui: 'decline',
				action: 'close',	
            },{
            	xtype: 'spacer'	
        	},{
				text: '历史考点',
				//iconCls: 'trash',
				ui: 'action',
				action: 'zsdhist',					
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'assess-title',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
		},{	
			xtype: 'panel',
			style: 'background:#fff;padding:15px;',
			//height: 100,
			itemId: 'topicInfo',
			// tpl: 
		}],
		
		listeners: [{
			delegate: 'button[action=zsdhist]',
			event: 'tap',
			fn: 'onZsdhist'
		},{
			delegate: 'button[action=close]',
			event: 'tap',
			fn: 'onClose'
		},{
			delegate: 'radiofield',
			event: 'check',
			fn: 'onDone'	
		},{
			element: 'element', 
			event: 'tap',
			delegate: 'img', // 聊天内容对方头像，单击显示个人信息
			fn: 'onZoom'
		}]
	},
	
	// setRecord lead to this，更新页面显示
	updateRecord: function(newRecord){
		var me = this;
		//alert(newRecord); // 有时控制器setrecord(record)，这个函数不运行？
		if(newRecord){
			console.log(newRecord.data);
			this.down('panel[itemId=topicInfo]').setData(newRecord.data);
		}
	},	
	
	// 历史考点雷达图
	onZsdhist: function(radio){
		var me = this
		var obj = {
			subjectID: 3,//me.getParentRecord().data.subjectID,
			gradeID: 9,//me.getParentRecord().data.gradeID,
			semester: '下',//me.getParentRecord().data.semester,
			schoolID: localStorage.schoolID,
		} 
		console.log(obj);
		me.fireEvent('zsdhist',obj, me);
	},
	
	onZoom: function(e){
		console.log(e.getTarget('img').complete)
		var isLoaded = e.getTarget('img').complete;
		if(!isLoaded)
			return false

		var zoom = Ext.create('Youngshine.view.teach.Zoom');
		zoom.down('imageviewer').setImageSrc(e.target.src);
		Ext.Viewport.setActiveItem(zoom);
	},	

	onClose: function(){
		var me = this;
		me.fireEvent('close', me);
	},
	
});