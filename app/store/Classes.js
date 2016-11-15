// 大小班级
Ext.define('Youngshine.store.Classes', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Classes',
	
    config: {
        model: 'Youngshine.model.Classes',
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
		},
		groupField: 'fullname',
    }
});
