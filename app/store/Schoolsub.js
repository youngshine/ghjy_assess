// 分校区：2级
Ext.define('Youngshine.store.Schoolsub', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Schoolsub',
	
    config: {
        model: 'Youngshine.model.Schoolsub',
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
