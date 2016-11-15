// 缴费子表
Ext.define('Youngshine.store.AccntDetail', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.AccntDetail',
	
    config: {
        model: 'Youngshine.model.AccntDetail',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
		groupField: 'title',
        groupDir: 'ASC',
    }
});
