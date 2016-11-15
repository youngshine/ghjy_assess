// 学校的分校区
Ext.define('Youngshine.model.Schoolsub', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'schoolsubID'}, 
			{name: 'fullname'}, 
			{name: 'schoolID'}, //所属学校
			{name: 'addr'}, 
			{name: 'phone'},
			{name: 'contact'}, //联系人
        ]
    }
});