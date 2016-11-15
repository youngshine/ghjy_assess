// Create a panel to put the chart in.
Ext.create('Ext.chart.Chart', {
    fullscreen: true,
    innerPadding: 10,
    store: {
        fields: ['name', 'g1', 'g2', 'g3', 'g4', 'g5'],
        data: [
            {"name": "0", "g1": 18.34, "g2": 0.04, "g3": 22.35, "g4": 10.50, "g5": 18.42},
            {"name": "1", "g1": 2.67, "g2": 14.87, "g3": 0.41, "g4": 19.15, "g5": 1.64},
            {"name": "2", "g1": 1.90, "g2": 5.72, "g3": 14.80, "g4": 38.93, "g5": 2.77},
            {"name": "3", "g1": 21.37, "g2": 2.13, "g3": 12.98, "g4": 63.82, "g5": 18.85},
            {"name": "4", "g1": 2.67, "g2": 8.53, "g3": 4.44, "g4": 87.39, "g5": 27.23},
            {"name": "5", "g1": 18.22, "g2": 4.62, "g3": 8.26, "g4": 97.63, "g5": 34.37},
            {"name": "6", "g1": 28.51, "g2": 12.43, "g3": 28.67, "g4": 108.29, "g5": 47.84},
            {"name": "7", "g1": 34.43, "g2": 4.40, "g3": 9.89, "g4": 127.27, "g5": 36.90},
            {"name": "8", "g1": 21.65, "g2": 13.87, "g3": 5.44, "g4": 112.49, "g5": 16.29},
            {"name": "9", "g1": 12.98, "g2": 35.44, "g3": 16.37, "g4": 135.54, "g5": 16.78},
            {"name": "10", "g1": 22.96, "g2": 38.70, "g3": 18.15, "g4": 114.96, "g5": 8.51},
            {"name": "11", "g1": 0.49, "g2": 51.90, "g3": 19.98, "g4": 95.00, "g5": 9.69},
            {"name": "12", "g1": 20.87, "g2": 62.07, "g3": 25.96, "g4": 87.79, "g5": 3.18},
            {"name": "13", "g1": 25.10, "g2": 78.46, "g3": 26.04, "g4": 91.54, "g5": 12.41},
            {"name": "14", "g1": 16.87, "g2": 56.80, "g3": 1.39, "g4": 71.78, "g5": 16.54}
        ]
    },
    background: 'white',

    // Set rotation and double tap reset interactions.
    interactions: ['rotate'],

    // Define radial and angular axis for the radar chart.
    axes: [
        {
            type: 'numeric',
            position: 'radial',
            fields: 'g1',
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
            fields: 'name',
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
            xField: 'name',
            yField: 'g1',
            style: {
                fillStyle: 'rgba(0,255,0,0.2)',
                strokeStyle: 'rgba(0,0,0,0.8)',
                lineWidth: 1
            }
        },
        {
            type: 'radar',
            xField: 'name',
            yField: 'g2',
            style: {
                fillStyle: 'rgba(0,255,0,0.2)',
                strokeStyle: 'rgba(0,0,0,0.8)',
                lineWidth: 1
            }
        }
    ]
});