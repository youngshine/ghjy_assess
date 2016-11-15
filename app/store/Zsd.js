// 课时套餐，各个校区不同
Ext.define('Youngshine.store.Zsd', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Zsd',
	
    config: {
        model: 'Youngshine.model.Zsd',
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
