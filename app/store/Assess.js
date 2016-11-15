// 测评记录
Ext.define('Youngshine.store.Assess', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Assess',
	
    config: {
        model: 'Youngshine.model.Assess',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
		sorters: {
			property: 'created',
			direction: 'DESC'
		}
    }
});
