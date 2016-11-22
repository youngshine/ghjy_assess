// 测评试卷的评分结果
Ext.define('Youngshine.view.student.assess.AssessResult',{
	extend: 'Ext.Panel',
	xtype: 'assess-result',
	
	//requires: ['Ext.Img','Ext.ActionSheet'], 
	
	config: {
		parentRecord: null, //container保存数据记录setRecord 学生
		parentView: null,
		parentSubject: null, //测评学科（年级、学期、科目）
		
		scrollable: true,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '测评结果报告', // 根据不同类型Type而变化，在updateRecord
			items: [{
				text: '关闭',
				ui: 'decline',
				action: 'close',	
            },{
            	xtype: 'spacer'	
        	},{
				text: '历年考点',
				//iconCls: 'trash',
				ui: 'action',
				action: 'zsdhist',					
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'assessSubject',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
		},{	
			xtype: 'panel',
			style: 'background:#fff;padding:15px;',
			//height: 100,
			itemId: 'topicList',
			// tpl: 
			tpl: new Ext.XTemplate(
			    '<tpl for=".">',     // interrogate the kids property within the data
					'<p>题目{#}：',
					'<tpl if="myAnswer == objective_answer">',
			            '<span style="color:green;">✔</span>',
					'<tpl else>',
						'<span style="color:red;">✘</span>',
			        '</tpl>',
					'<span style="float:right;">{myAnswer}／{objective_answer}</p>',
					'<p style="color:#888;font-size:0.8em;">知识点：{zsdName}</p>',
			    '</tpl>'
			)
		},{
			height: 350,
			xtype: 'panel',
			items: [{			
				height: 300,
	            xtype: 'chart',
	            background: "none",
	            store: {
					fields: ['name', 'value1', 'value2'],
					data: []
				},
	            animate: true,
	            interactions: ['panzoom', 'itemhighlight'],
	            legend: {
	                position: "bottom"
	            },
	            series: [{
	                type: 'line',
	                xField: 'name',
	                yField: 'value1',
	                title: '做对',
	                style: {
	                    smooth: true,
	                    stroke: '#115fa6',
	                    lineWidth: 3,
	                    shadowColor: 'rgba(0,0,0,0.7)',
	                    shadowBlur: 10,
	                    shadowOffsetX: 3,
	                    shadowOffsetY: 3
	                },
	                highlightCfg: {
	                    scale: 2
	                },
	                marker: {
	                    type: 'circle',
	                    stroke: '#0d1f96',
	                    fill: '#115fa6',
	                    lineWidth: 2,
	                    radius: 4,
	                    shadowColor: 'rgba(0,0,0,0.7)',
	                    shadowBlur: 10,
	                    shadowOffsetX: 3,
	                    shadowOffsetY: 3,
	                    fx: {duration: 300}
					}	
	            },{
	                type: 'bar',
	                xField: 'name',
	                yField: ['value2'],
	                title: ['题目'],
	                style: {
	                    maxBarWidth: 15,
	                    lineWidth: 1.5,
	                    fill: "#a61120",
	                    stroke: 'black',
	                    shadowColor: 'rgba(0,0,0,0.7)',
	                    shadowBlur: 10,
	                    shadowOffsetX: 3,
	                    shadowOffsetY: 3
	                }
	            }],
	            axes: [{
	                type: 'numeric',
	                position: 'left',
	                grid: {
	                    odd: {
	                        fill: '#fafafa'
	                    }
	                },
	                style: {
	                    axisLine: false,
	                    estStepSize: 20,
	                    stroke: '#ddd'
	                },
	                minimum: 0,
	                maximum: 5
	            },{
	                type: 'category',
	                position: 'bottom',
	                //visibleRange: [0, 0.7],
	                style: {
	                    estStepSize: 1,
	                    stroke: '#999'
	                }
	            }]
			}]
		},{
			xtype: 'panel',
			style: 'background:#fff;padding:15px;',
			itemId: 'zsdList',	
			tpl: new Ext.XTemplate(
			    '<tpl for=".">',     // interrogate the kids property within the data
					'<p>{name}<span style="float:right;color:#888;">{#}</span></p>',
					'<tpl if="value1 == value2">',
			            '<p style="color:green;">不错，继续保持。</p>',
					'<tpl else>',
						'<p style="color:red;">有待提高。</p>',
			        '</tpl>',
					'<p style="color:#888;">{description}</p>',
					'<br>',
			    '</tpl>'
			)
		}],
		
		listeners: [{
			delegate: 'button[action=zsdhist]',
			event: 'tap',
			fn: 'onZsdhist'
		},{
			delegate: 'button[action=close]',
			event: 'tap',
			fn: 'onClose'
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
			subjectID: me.getParentSubject().subjectID,
			gradeID: me.getParentSubject().gradeID,
			semester: me.getParentSubject().semester,
			schoolID: localStorage.schoolID, //忽略，都用泉州的
		} 
		console.log(obj);
		me.fireEvent('zsdhist',obj, me);
	},

	onClose: function(){
		var me = this;
		console.log(me.getParentRecord())
		//console.log(JSON.stringify(me.getParentRecord()))
    	Ext.Msg.confirm('询问',"关闭，推送报告给家长？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('close', me.getParentRecord(), me);
			}
		});	
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
});