// 测评试卷
Ext.define('Youngshine.view.student.Assess-page',{
	extend: 'Ext.Container',
	xtype: 'assess-page',
	
	//requires: ['Ext.Img','Ext.ActionSheet'], 
	
	config: {
		record: null, //container保存数据记录setRecord
		scrollable: true,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '测评试卷', // 根据不同类型Type而变化，在updateRecord
			items: [{
				text: '返回',
				ui: 'back',
				action: 'back',	
            },{
            	xtype: 'spacer'	
        	},{
				text: '答题卡',
				//iconCls: 'trash',
				ui: 'action',
				action: 'answer',					
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
			delegate: 'button[action=answer]',
			event: 'tap',
			fn: 'onAnswer'
		},{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
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
	
	onAnswer: function(radio){
		var me = this; 
		this.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			//centered: true,
			top:0,right:0,
			width: 420,
			height: '100%',
			scrollable: true,
			layout: 'vbox',
	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
				ui: 'light',
	        	title: '答题卡',
				items: [{
					text: '提交'	,
					ui: 'confirm',
					action: 'save',
					handler: function(btn){
						//btn.up('panel').onSave()
						var modal = btn.up('panel');console.log(modal)
						var psw1 = modal.down('passwordfield[itemId=psw1]').getValue().trim(),
							psw2 = modal.down('passwordfield[itemId=psw2]').getValue().trim()
						console.log(psw1)
						if(psw1.length<6){
							Ext.toast('密码少于6位',3000); return
						}
						if(psw1 != psw2){
							Ext.toast('确认密码错误',3000); return
						}
						// ajax
						Ext.Ajax.request({
						    url: Youngshine.app.getApplication().dataUrl + 'updatePsw.php',
						    params: {
						        psw1     : psw1,
								consultID: localStorage.consultID
						    },
						    success: function(response){
						        var text = response.responseText;
						        // process server response here
								Ext.toast('密码修改成功',3000)
								modal.destroy()
						    }
						});
					}
				}]
			},{
				xtype: 'fieldset',
				//width: 400,
				defaults: {
					//labelAlign: 'right'
				},
				items: [{
					xtype: 'textfield',
					readOnly: true,
					label: '学校',
					value: localStorage.schoolName
				},{
					xtype: 'textfield',
					readOnly: true,
					label: '咨询师',
					value: localStorage.consultName
				},{	
					xtype : 'passwordfield',
					itemId : 'psw1',
					//margin: '1 10 0 10',
					label : '新密码', //比对确认密码
					scope: this
				},{
					xtype : 'passwordfield',
					itemId : 'psw2',
					//margin: '1 10 0 10',
					label : '确认密码', 
					scope: this
				}]	
			}],	
		})
		this.overlay.show()
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

	onBack: function(){
		var me = this;
		me.fireEvent('back', me);
	},
	
});