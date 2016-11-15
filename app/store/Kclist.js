// 全校课程
Ext.define('Youngshine.store.Kclist', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Kclist',
	
    config: {
        model: 'Youngshine.model.Kclist',
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
