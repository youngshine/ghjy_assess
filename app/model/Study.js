// 对应课时套餐的子表：报读知识点
Ext.define('Youngshine.model.Study', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'studentstudyID'}, 
			{name: 'prepaidID'},
			{name: 'taocan'},
			{name: 'OrderID'}, //交易单
			{name: 'studentID'}, // 学生
			{name: 'studentName'},
			{name: 'zsdID'}, // 补习知识点
			{name: 'zsdName'}, // 知识点名称，前端显示用
			{name: 'subjectID'}, // 学科
			{name: 'subjectName'}, // 学科名称
			{name: 'gradeName'}, //关联表的字段名称
		
			{name: 'times'}, //课时
			{name: 'fee'}, //课时费	
			{name: 'discount'}, //折扣／100
			{name: 'payment'}, //付款方式
			{name: 'prepaid'}, //预缴费flag 0,1
		
			{name: 'teacherID'}, 
			{name: 'teacherName'}, 
			//{name: 'teach_weekday'}, //每周那天上课
			//{name: 'teach_timespan'}, //上课时间段
			{name: 'timely_list', defaultValue: '未排课'}, //上课时间段列表
		
			{name: 'pass'}, //教学通过flag 0,1
			{name: 'pass_date'},
			{name: 'test'}, //咨询师考试通过flag 0,1
			{name: 'test_date'},
			{name: 'paid'}, //家长确认学习通过，付款
			{name: 'paid_date'},
		
			{name: 'note'}, //备注：特殊情况如一周上两次
			{name: 'created'}
        ]
    }
});