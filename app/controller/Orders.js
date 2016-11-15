// 购买课时订单相关的控制器，
Ext.define('Youngshine.controller.Orders', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	orders: 'orders',
			ordersaddnew: 'orders-addnew',
			student: 'orders-student',
			pricelist: 'orders-pricelist',
			ordersstudy: 'orders-study', //套餐的子记录（报读知识点）
			studyzsd: 'study-zsd', //添加报读记录
			studykcb: 'study-kcb', //排课
        },
        control: {
			orders: {
				addnew: 'ordersAddnew',
				itemtap: 'ordersItemtap',
				itemswipe: 'ordersItemswipe' // 删除
			},
			ordersaddnew: {
				save: 'ordersaddnewSave', 
				cancel: 'ordersaddnewCancel',
				student: 'ordersaddnewStudent', //查找选择学生
				pricelist: 'ordersaddnewPricelist', //查找选择学生 
			},
			student: {
				//search: '', //itemtap
				itemtap: 'studentItemtap'
			},
			pricelist: {
				itemtap: 'pricelistItemtap'
			},
			ordersstudy: {
				back: 'ordersstudyBack',
				addnew: 'ordersstudyAddnew',
				itemtap: 'ordersstudyItemtap', // '排课'点击按钮
				itemswipe: 'ordersstudyItemswipe' // 删除
			},
			studyzsd: {
				itemtap: 'studyzsdItemtap' //添加报读记录
			},
			studykcb: {
				done: 'studykcbDone' //排课，分配教师、上课时间
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	ordersList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'orders') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.orders = Ext.create('Youngshine.view.orders.List');
		Ext.Viewport.add(me.orders);
		Ext.Viewport.setActiveItem(me.orders);
		
		var obj = {
			"consultID": localStorage.consultID
		}	
		console.log(obj)	
		var store = Ext.getStore('Orders'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readOrdersList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
				console.log(records)
		        if (success){
					
				};
			}   		
		});	  			 
	},
	
	// 向左滑动，删除
	ordersItemswipe: function( list, index, target, record, e, eOpts ){
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
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteOrders.php',
			    params: {
					prepaidID: rec.data.prepaidID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Orders').remove(rec);
					}		         
			    }
			});
		}
	},	

	ordersAddnew: function(win){		
		var me = this;
		/*
		if(!me.ordersaddnew){
			me.ordersaddnew = Ext.create('Youngshine.view.orders.Addnew');
			Ext.Viewport.add(me.ordersaddnew)
		} */
		// have been destroyed
		me.ordersaddnew = Ext.create('Youngshine.view.orders.Addnew');
		Ext.Viewport.add(me.ordersaddnew)
		Ext.Viewport.setActiveItem(me.ordersaddnew)
		
		// 当前校区的课时套餐价格表
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Pricelist'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){

			}   		
		});	
	},
	
	// 取消添加
	ordersaddnewCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.ordersaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.orders);
	},	
	ordersaddnewSave: function( obj,oldView )	{
    	var me = this; console.log(obj)

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.data.JsonP.request({
				    url: me.getApplication().dataUrl + 'createOrders.php',
				    params: {
						data: JSON.stringify(obj)
					},
				    success: function(result){
						//oldView.destroy(); console.log(result)
						Ext.Viewport.remove(me.ordersaddnew,true)
						Ext.Viewport.setActiveItem(me.orders);
						obj.prepaidID = result.data.prepaidID
						obj.created = '刚刚';
						Ext.getStore('Orders').insert(0,obj)					
				    }
				});
			}
		});	
	},
	// 查找选择购买的学生
	ordersaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.orders.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示

		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID //必须带上校区，否则公众号学生没归属咨询师
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					//Ext.Viewport.setActiveItem(me.student);
					me.student.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.ordersaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName+'［'+record.data.grade+'］')
		me.ordersaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
	},
	// 查找选择校区的课时套餐价格
	ordersaddnewPricelist: function(btn)	{
    	var me = this; 
		me.pricelist = Ext.create('Youngshine.view.orders.Pricelist');
		Ext.Viewport.add(me.pricelist); //否则build后无法显示

		var obj = {
			"schoolID": localStorage.schoolID
		}	
		console.log(obj)	
		var store = Ext.getStore('Pricelist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					//Ext.Viewport.setActiveItem(me.student);
					me.pricelist.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	pricelistItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.ordersaddnew.down('textfield[name=taocan]').setValue(record.data.title)
		me.ordersaddnew.down('hiddenfield[name=hour]').setValue(record.data.hour)
		me.ordersaddnew.down('hiddenfield[name=amount]').setValue(record.data.unitprice)
	},
	
	// 显示课时套餐的报读课程知识点记录
	ordersItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(record)
		if(!me.ordersstudy){
			me.ordersstudy = Ext.create('Youngshine.view.orders.Study')
			Ext.Viewport.add(me.ordersstudy)
		}		
		me.ordersstudy.setRecord(record); //带入当前知识点
		me.ordersstudy.down('label[itemId=taocan]').setHtml(record.data.taocan)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取报读知识点'});
		// 预先加载的数据
		var obj = {
			"prepaidID": record.data.prepaidID,
		}
		var store = Ext.getStore('Study'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readStudyList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.setActiveItem(me.ordersstudy);
				}else{
					Ext.toast('出错',3000);
				};
			}   		
		});	
	},
	// 返回
	ordersstudyBack: function(oldView){		
		var me = this;
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.orders);
	},
	ordersstudyAddnew: function(btn){		
    	var me = this; 
		me.studyzsd = Ext.create('Youngshine.view.orders.study.Zsd');
		Ext.Viewport.add(me.studyzsd); //否则build后无法显示
		me.studyzsd.show(); // overlay show
		
		// 选择学科，才显示知识点
		var store = Ext.getStore('Zsd');
		store.removeAll()
		store.clearFilter()
	},
	// 向左滑动，删除
	ordersstudyItemswipe: function( list, index, target, record, e, eOpts ){
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
	ordersstudyItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		
		if(e.target.className == 'kcb'){
			me.studykcb = Ext.create('Youngshine.view.orders.study.Kcb');
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
	},
	
	// 选中报读知识点
	studyzsdItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		
		var obj = {
			zsdID: record.data.zsdID,
			zsdName: record.data.zsdName,
			subjectID: record.data.subjectID,
			studentID: me.ordersstudy.getRecord().data.studentID,
			prepaidID: me.ordersstudy.getRecord().data.prepaidID
		}
		Ext.data.JsonP.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'createStudy.php',
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
	},
	
	// 排课：分配任课教师及上课时间
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
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('orders controller init');
	}
});
