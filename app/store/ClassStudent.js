// 班级的子表：报读学生
Ext.define('Youngshine.store.ClassStudent', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.ClassStudent',
	
    config: {
        model: 'Youngshine.model.ClassStudent',
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
