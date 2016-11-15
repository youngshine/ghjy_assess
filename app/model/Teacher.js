// 某个校区的教师
Ext.define('Youngshine.model.Teacher', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'teacherID'}, 
			{name: 'teacherName'}, 
			{name: 'gender'}, 
			{name: 'phone'}, 
			{name: 'subjectID'},	
			{name: 'subjectName'}, 
			{name: 'note'}, 
			{name: 'schoolID'},
			{name: 'schoolName'}, // 通过学习
			{name: 'pass_date'},
        ]
    }
});