// 某个学科的知识点
Ext.define('Youngshine.model.Zsd', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'zsdID'}, // 补习知识点
			{name: 'zsdName'}, 
			{name: 'subjectID'}, //
			{name: 'subjectName'}, // 学科名称，前端显示
			{name: 'gradeID'},
			{name: 'gradeName'}, //年级，关联表的字段名称
			{name: 'semester'},
			{name: 'fee'}, //课时费	
			{name: 'times'}, //课时	
		
			{name: 'select',type: 'boolean', defaultValue: false} //, convert: null} //用于出错打勾，数据库没有的字段
        ]
    }
});