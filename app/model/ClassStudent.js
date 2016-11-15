// 某个班级的报读学生class_student（可能学生报读课时与默认课时不同，少报）
Ext.define('Youngshine.model.ClassStudent', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'classstudentID'}, 
			{name: 'classID'},
			//{name: 'hour'}, // 该学生报读课时不同一，有的会少报
			//{name: 'amount'}, 
			{name: 'note'}, 
			{name: 'current'}, //禁用，不参加点名，因为退费或提前报读
			{name: 'studentID'}, 
			{name: 'studentName'},
			
			{name: 'accntdetailID'}, //报读记录，方便更改待排班状态isClassed
			
			{ name: 'fullCurrent', convert: function(value, record){
					return record.get('current')==1?'在读':'禁读'
				} 
			},
	    ]
    }
});