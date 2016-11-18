// 注册学生列表
Ext.define('Youngshine.model.Student', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'studentID'}, 
			{name: 'studentName'}, 
			{name: 'wxID'}, //微信，发模版消息用
			{name: 'gender'}, 
			{name: 'grade'}, 
			{name: 'born'}, 
			{name: 'phone'}, 
			{name: 'addr'}, 
			{name: 'note'}, 
			//{name: 'level_list'}, //各学科123报读咨询测评的水平，以获得自适应第一组5个题目
			
			{name: 'consultID'}, //所属咨询师
			{name: 'schoolID'}, //学校，报名或网上注册选择
			{name: 'schoolsubID'}, //学校下的分校区，由咨询师分配
			{name: 'schoolsub'}, //分校区fullname
			
			{name: 'pass'}, // 通过学习
			{name: 'pass_date'},
			
			{ name: 'fullPass', convert: function(value, record){
					return record.get('pass')==1?'通过学习':''
				} 
			},
			// 组合字段，搜索过滤用, 中间间隔空格， 避免...
			{ name: 'fullStudent', convert: function(value, record){
					//var date = record.get('drive_date');
					return record.get('studentName') + ' ' + record.get('gender') + ' ' +
					record.get('grade') + ' ' + record.get('phone') + ' ' + record.get('schoolsub'); 
				} 
			},
        ]
    }
});