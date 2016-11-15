// 教师
Ext.define('Youngshine.store.Teacher', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Teacher',
	
    config: {
        model: 'Youngshine.model.Teacher',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
        sorters: [{ // 最新发布的线路排在顶部，不起作用？
			property: 'created',
			//direction: "DESC"
		}]
    }
});
