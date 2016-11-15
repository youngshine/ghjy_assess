// 某个咨询师的班级
Ext.define('Youngshine.model.Classes', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'classID'}, 
			{name: 'title'}, // 名称
			{name: 'kclistID'}, //所属课程
			{name: 'kmType'}, //课程科目分类：数理化，语政英，史地生，艺术
			{name: 'persons'}, // 计划招满人数
			{name: 'enroll'}, //实际报读人数
			{name: 'note'}, 
			//{name: 'hour'}, // 要测评学科
			//{name: 'amount'}, // 学科名称
			{name: 'beginDate'}, // 开课日期
			{name: 'timely_list'}, //上课时间列表
			//{name: 'classType'}, // 科目
			
			{name: 'created'},	
			
			{name: 'teacherID'}, // 班级教师，待定？
			{name: 'teacherName'}, //所属的咨询师
			
			{name: 'consultID'}, // 班级教师，待定？
			{name: 'consultName'},	
			
			{name: 'schoolsubID'}, // 班级属于某个分校区
			{name: 'fullname'},

		
			{ name: 'fullDate', convert: function(value, record){
					return record.get('beginDate').substr(2,8);
				} 
			}, 
	    ]
    }
});