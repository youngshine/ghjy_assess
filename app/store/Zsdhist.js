Ext.define('Youngshine.store.Zsdhist', {
    alias: 'store.Zsdhist',
    extend: 'Ext.data.Store',
    config: {
		fields: [
			{name: 'zsdName', type: 'string'},
			{name: 'Y1'},
			{name: 'Y2'},
			{name: 'Y3'},
			{name: 'Yavg'}
		], 
		
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
    }
});