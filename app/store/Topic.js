// 测评题目?? 题目
Ext.define('Youngshine.store.Topic', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Topic',
	
    config: {
        model: 'Youngshine.model.Topic',
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
