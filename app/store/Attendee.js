// 班级的子表：报读学生
Ext.define('Youngshine.store.Attendee', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Attendee',
	
    config: {
        model: 'Youngshine.model.Attendee',
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
			//property: 'created',
			//direction: 'DESC'
		}
    }
});
