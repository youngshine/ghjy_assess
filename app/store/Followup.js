// 与学生沟通联络记录
Ext.define('Youngshine.store.Followup', {
    extend: 'Ext.data.Store',
	//requires: 'Youngshine.model.Assess',
	
    config: {
        //model: 'Youngshine.model.Assess',
	    fields: [
			{name: 'studentfollowID'}, 
			{name: 'studentID'}, // 学生
			{name: 'studentName'},
			{name: 'content'}, // 沟通内容
			{name: 'consultID'}, 
			{name: 'created'},

	    ],
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
