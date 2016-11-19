// 测评的题目
Ext.define('Youngshine.model.Topic', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'topicID'}, 
			{name: 'gid'}, //题目id字符
			{name: 'ROW'}, // 题目序号 (SELECT @row :=0)
			{name: 'content'}, 	
			{name: 'objective_answer'}, 
			{name: 'answer'}, 
			{name: 'level'}, //题目难度：低1中2高3
			{name: 'score'}, //题目分数1-15
			{name: 'zsdID_list'}, // 所属知识点列表
			//{name: 'zsdName_list'}, // 知识点名称，前端显示用
			{name: 'zsdName'}, // 知识点名称，前端显示用
			{name: 'subjectID'}, // 学科
			{name: 'subjectName'}, // 学科名称
			{name: 'gradeID'},
			{name: 'gradeName'}, //关联表的字段名称
		
			{name: 'myAnswer', type: 'string', defaultValue: '未选择'}, //ABCD
			
			{name: 'done'}, //做题结果：错0，对1

			{ name: 'fullLevel', convert: function(value, record){
					var level = record.get('level');
					if(level==1)
						return '低';
					if(level==2)
						return '中';
					if(level==3)
						return '高';
				} 
			},
		]	
    }
});