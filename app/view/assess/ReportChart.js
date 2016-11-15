Ext.define('Youngshine.view.assess.ReportChart', {
    extend: 'Ext.Panel',
    xtype: 'assess-report',

    requires: [
        'Ext.chart.Chart',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Category'
    ],

    config: {
        layout: 'vbox',
		scrollable: true,
        items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '测评报告',
			items: [{
				xtype: 'spacer'
			},{	
				ui : 'confirm',
				//action: 'back',
				text : '完成',
				handler: function(){
					//this.up('list').onBack()
					this.up('panel').destroy()
				}
			}]	
		},{
			xtype: 'component',
			itemId: 'student',
			html: '',
			height: 50,
			margin: '10 10 0',
			style: 'color:#888;font-size:0.8em;'
		},{
			xtype: 'component',
			itemId: 'zsd',
			html: '',
			margin: '0 10',
			style: 'color:#888;font-size:0.8em;'
		},{
            flex: 1,
			xtype: 'polar',
            //field: 'Yavg',
            //legendField: 'zsdName',
            //radiusFactor: 50,
            //donut: 30,
			
		    store: 'Zsdhist',
			
		//configure the legend.
		    legend: {
		        position: 'right',
		        width: 250
		    },
  
            
		// Set rotation and double tap reset interactions.
		    interactions: ['rotate'],
			
			colors: ["#115fa6", "#94ae0a", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"],

		//describe the actual pie series.
		    series: [
		        {
		            type: 'pie',
		            xField: 'Yavg',
		            label: {
		                field: 'zsdName',
		                display: 'rotate'
		            },
		            donut: 25,
		            style: {
		                miterLimit: 10,
		                lineCap: 'miter',
		                lineWidth: 2
		            }
		        }
		    ]
        }]
    }
});