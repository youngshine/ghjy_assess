// 课程，全校通用（不属于咨询师）：大小班、一对一合并
Ext.define('Youngshine.model.Kclist', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'kclistID'}, 
			{name: 'kcType'}, // 大小班，一对一
			{name: 'title'}, // 名称
			{name: 'kmType'}, // 分类：数理化、实地生。。。
			{name: 'unitprice'}, // 要测评学科
			{name: 'hour'}, // 要测评学科
			{name: 'amount'}, // 学科名称		
			{name: 'schoolID'}, // 班级教师，待定？
			//{name: 'schoolName'},		
			{name: 'created'},		
	    ]
    }
});