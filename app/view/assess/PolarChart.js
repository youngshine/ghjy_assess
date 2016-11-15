Ext.define('Youngshine.view.assess.PolarChart', {
    extend: 'Ext.Panel',
    xtype: 'assess-hist',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Category'
    ],

    config: {
        layout: 'fit',
        items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '历年考点',
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
            xtype: 'polar',
		    store: 'Zsdhist',
            background: 'white',
            
		// Set rotation and double tap reset interactions.
		    interactions: ['rotate'],

		    // Define radial and angular axis for the radar chart.
		    axes: [
		        {
		            type: 'numeric',
		            position: 'radial',
		            fields: ['Y1', 'Y2', 'Y3'],
		            grid: true,
		            style: {
		                estStepSize: 20
		            },
		            label: {
		                fill: 'black',
		                y: -8
		            }
		        },
		        {
		            type: 'category',
		            position: 'angular',
		            fields: 'zsdName',
		            grid: true,
		            style: {
		                estStepSize: 2
		            },
		            label: {
		                fill: 'black'
		            }
		        }
		    ],

		    series: [
		        {
		            type: 'radar',
		            xField: 'zsdName',
		            yField: 'Y1',
		            style: {
		                fillStyle: 'rgba(255,0,0,0.2)',
		                strokeStyle: 'rgba(255,0,0,0.8)',
		                lineWidth: 1
		            }
		        },
		        {
		            type: 'radar',
		            xField: 'zsdName',
		            yField: 'Y2',
		            style: {
		                fillStyle: 'rgba(0,255,0,0.2)',
		                strokeStyle: 'rgba(0,255,0,0.8)',
		                lineWidth: 1
		            }
		        },
		        {
		            type: 'radar',
		            xField: 'zsdName',
		            yField: 'Y3',
		            style: {
		                fillStyle: 'rgba(0,0,255,0.2)',
		                strokeStyle: 'rgba(0,0,255,0.8)',
		                lineWidth: 1
		            }
		        }
		    ],
			legend: {
			      position: 'bottom'
			    },
        }]
    }
});