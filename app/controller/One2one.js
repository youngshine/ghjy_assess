// 一对一排课相关的控制器，
Ext.define('Youngshine.controller.One2one', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	one2one: 'one2one',
			one2onestudy: 'one2one-study', //套餐的子记录（报读知识点）
			studyzsd: 'study-zsd', //添加报读记录 overlay
			studykcb: 'study-kcb', //排课 overlay
			timely: 'timely', //选择星期几、上课具体时间
        },
        control: {
			one2one: {
				itemtap: 'one2oneItemtap',
			},
			one2onestudy: {
				back: 'one2onestudyBack',
				addnew: 'one2onestudyAddnew',
				itemtap: 'one2onestudyItemtap', // '排课'点击按钮
				itemswipe: 'one2onestudyItemswipe' // 删除
			},
			studyzsd: {
				//itemtap: 'studyzsdItemtap' //添加报读记录
				choose: 'studyzsdChoose'
			},
			studykcb: {
				save: 'studykcbSave', 
				cancel: 'studykcbCancel',
				timely: 'studykcbTimely', //同addnew
			},
			timely: {
				done: 'timelyDone'
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	// 读取缴费购买课程中，一对一部分，不是大小班
	accntdetailList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'one2one') return
		Ext.Viewport.remove(curView,true); //remove 当前界面
		
		me.one2one = Ext.create('Youngshine.view.one2one.List');
		Ext.Viewport.add(me.one2one);
		Ext.Viewport.setActiveItem(me.one2one);
		
		var obj = {
			"consultID": localStorage.consultID,
			"accntType": "一对一"
		}	
		console.log(obj)	
		var store = Ext.getStore('AccntDetail'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAccntDetailList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
				console.log(records)
		        if (success){
					//store.filter("accntType","一对一")
				};
			}   		
		});	  			 
	},

	// 显示课时套餐的报读课程知识点记录
	one2oneItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 

		me.one2onestudy = Ext.create('Youngshine.view.one2one.Study')
		me.one2onestudy.setRecord(record); //带入参数：一对一缴费单及其学生
		me.one2onestudy.down('label[itemId=title]')
			.setHtml(record.data.hour+'课时｜'+record.data.studentName)
		Ext.Viewport.add(me.one2onestudy)
		Ext.Viewport.setActiveItem(me.one2onestudy);

		var obj = {
			"accntdetailID": record.data.accntdetailID,
		}
		var store = Ext.getStore('Study'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readStudyListByAccntdetail.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
					
				}else{
					Ext.toast('出错',3000);
				};
			}   		
		});	
	},
	// 返回
	one2onestudyBack: function(oldView){		
		var me = this; 
		Ext.Viewport.setActiveItem(me.one2one);
		//Ext.Viewport.remove(me.one2onestudy); //remove 当前界面
	},
	one2onestudyAddnew: function(rec,oldView){		
    	var me = this; 
		me.studyzsd = Ext.create('Youngshine.view.one2one.study.Zsd');
		me.studyzsd.setParentRecord(rec); //父窗口参数：缴费单及其学生
		Ext.Viewport.add(me.studyzsd); //否则build后无法显示
		me.studyzsd.show(); // overlay show
		
		// 选择学科，才显示知识点，先清除
		var store = Ext.getStore('Zsd');
		store.removeAll()
		store.clearFilter()
	},
	// 向左滑动，删除
	one2onestudyItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false

		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					del(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			console.log(rec)
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteStudy.php',
			    params: {
					studentstudyID: rec.data.studentstudyID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Study').remove(rec);
					}		         
			    }
			});
		}
	},	
	// 排课：单击‘排课kcb’
	one2onestudyItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		
		if(e.target.className == 'kcb'){
			me.studykcb = Ext.create('Youngshine.view.one2one.study.Kcb');
			Ext.Viewport.add(me.studykcb); //否则build后无法显示
			//me.studykcb.show()
			console.log(record.data)
			me.studykcb.setRecord(record)
			
			// 任课教师selectfield，没有store,这样才能显示名字
			var selectBox = me.studykcb.down('selectfield[name=teacherID]')
			console.log(selectBox)
			selectBox.setOptions([
			    {teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
			    //{text: 'Third Option',  value: 'third'}
			])
			selectBox.setValue(record.data.teacherID);
			console.log(selectBox.getValue())
		}	
		
		me.studykcb = Ext.create('Youngshine.view.one2one.study.Kcb');
		Ext.Viewport.add(me.studykcb); //否则build后无法显示
		Ext.Viewport.setActiveItem(me.studykcb);
		console.log(record.data)
		me.studykcb.setRecord(record)
		//me.studykcb.down('list').getStore().removeAll(); //清除上课周期列表
		// 上课周期列表数组，list.store
		if(record.data.timely_list != ''){
			var timely_list = record.data.timely_list.split(',')
			console.log(timely_list)
			var timely = [];
			for (var i = 0; i < timely_list.length; i++) {
				timely.push( {"timely":timely_list[i]}  )
			}
			console.log(timely);
			me.studykcb.down('list').getStore().setData(timely)
		}
		
		// 任课教师
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Teacher'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    if (success){
					// 任课教师selectfield，不用store,这样才能显示名字
					var selectBox = me.studykcb.down('selectfield[name=teacherID]')
					console.log(records)
					selectBox.updateOptions(records)
					selectBox.setValue(record.data.teacherID); 
					/*
					selectBox.updateOptions([
						{teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
					    //{text: 'Third Option',  value: 'third'}
					]) */
				};
			} 
		})
	},
	
	// 选择并点击确定报读知识点 zsdID+subjectID // itemtap
	//studyzsdItemtap: function( list, index, target, record, e, eOpts )	{
	studyzsdChoose: function( obj,oldView )	{
    	var me = this; 
		/*list.hide()
		
		var obj = {
			zsdID: record.data.zsdID,
			zsdName: record.data.zsdName,
			subjectID: record.data.subjectID,
			times: record.data.times,
			studentID: me.one2onestudy.getRecord().data.studentID,
			//prepaidID: me.ordersstudy.getRecord().data.prepaidID
			accntID: me.one2onestudy.getRecord().data.accntID
		} */
		Ext.data.JsonP.request({ 
            url: me.getApplication().dataUrl +  'createStudy.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; // model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面
				Ext.toast('添加成功')		
            }
		});
	},
	
	// 取消添加
	studykcbCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.studykcb,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.one2onestudy);
	},	
	studykcbSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateStudyByKcb.php',
		    params: obj,
		    success: function(result){
		        //var text = response.responseText; Ext.JSON.decode JSON.parse()
				console.log(result)
				Ext.toast('排课成功',3000)
				Ext.Viewport.remove(me.studykcb,true); //remove 当前界面
				Ext.Viewport.setActiveItem(me.one2onestudy);
		    }
		});
	},

	// 上课时间（多个，数组存储转换），新增／修改通用
	studykcbTimely: function(btn,oldView)	{
    	var me = this; 
		me.timely = Ext.create('Youngshine.view.one2one.study.Timely');
		me.timely.setParentView(oldView); //调用的父表单
		Ext.Viewport.add(me.timely); //否则build后无法显示
		me.timely.show();
	},
		
	timelyDone: function(obj,parentView){
    	var me = this; 
		//var store = me.classesaddnew.down('list').getStore();
		var store = parentView.down('list').getStore();
		console.log(store)
		store.insert(0,obj); //新增记录，排在最前面
	},
	
	/* 排课：分配任课教师及上课时间
	studykcbDone: function(obj,oldView)	{
    	var me = this; 
		Ext.Ajax.request({
			url: me.getApplication().dataUrl +  'updateStudyByKcb.php',
			params: obj,
            success: function(response){
				Ext.toast('排课成功',3000)
				oldView.destroy()	
				// 要即时更新前端数据才能正确显示	record.set(obj)
            }
		})
		return
		
		Ext.data.JsonP.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'updateStudyByKcb.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; // model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面
				Ext.toast('添加知识点成功',3000)		
            }
		});
	}, */
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('one2one controller init');
	}
});
