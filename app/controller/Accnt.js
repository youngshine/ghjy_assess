// 购买缴费的控制器，退费？？大小班或一对一退费，调出来
Ext.define('Youngshine.controller.Accnt', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	accnt: 'accnt',
			//accntmore: 'accnt-more', //缴费的购买课程明细：一对一或大小班
			accntaddnew: 'accnt-addnew', // 大小班与一对一，2个公用相同xtype
			//accntaddnew1to1: 'accnt-addnew-1to1',
			//accntaddnewclass: 'accnt-addnew-class',
			student: 'accnt-student',
			kclistclass: 'kclist-class', //大小班课程
			kclistone2one: 'kclist-one2one', //课程：一对一
			kclistrefund: 'kclist-refund',
        },
        control: {
			accnt: {
				//addnew_1to1: 'accntAddnew_1to1', // 购买缴费一对一套餐，一次一个套餐
				addnew: 'accntAddnew',// 购买报读大小班，一次可报读多个班
				itemtap: 'accntItemtap',
				itemswipe: 'accntItemswipe' // 删除
			}, /*
			accntaddnew1to1: {
				save: 'accntaddnew1to1Save', 
				cancel: 'accntaddnew1to1Cancel',
				student: 'accntaddnewStudent', //查找选择学生
				//pricelist: 'accntaddnewPricelist', //查找选择学生 
			}, */
			accntaddnew: {
				save: 'accntaddnewSave', 
				cancel: 'accntaddnewCancel',
				student: 'accntaddnewStudent', //查找选择学生
				//classes: 'accntaddnewClasses', //查找选择学生
				kclistClass: 'accntaddnewKclistClass', //大小班可能
				kclistOne2one: 'accntaddnewKclistOne2one', //一对一课程
				kclistRefund: 'accntaddnewKclistRefund', //退费课程：已购买的大小班、一对一课程
			},
			student: {
				itemtap: 'studentItemtap'
			}, 
			kclistone2one: {
				done: 'kclistone2oneDone'
			}, 
			kclistclass: {
				itemtap: 'kclistclassItemtap'
			}, 
			kclistrefund: {
				itemtap: 'kclistrefundItemtap'
			},
			/*
			accntmore: {
				back: 'accntmoreBack',
				//addnew: 'ordersstudyAddnew',
				itemtap: 'accntmoreItemtap', // '排课'点击按钮
				itemswipe: 'accntmoreItemswipe' // 删除
			}, */
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	accntList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'Accnt') return
 		   
		// 先show view,然后load data，会有默认load mask   
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.accnt = Ext.create('Youngshine.view.accnt.List');
		Ext.Viewport.add(me.accnt);
		Ext.Viewport.setActiveItem(me.accnt);
		
		var obj = {
			"consultID": localStorage.consultID
		}	
		console.log(obj)	
		var store = Ext.getStore('Accnt'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAccntList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
				console.log(records)
		        if (success){
					me.accnt.onToggle('大小班'); //一开始默认运行
				};
			}   		
		});	 
		
		// 学校的所有咨询
		var objConsult = {
			"schoolID": localStorage.schoolID
		}
		var storeConsult = Ext.getStore('Consult'); 
		storeConsult.removeAll()
		storeConsult.clearFilter() 
		storeConsult.getProxy().setUrl(me.getApplication().dataUrl + 
			'readConsultList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
				console.log(records)
			}   		
		});				 
	},
	
	// 向左滑动，删除
	accntItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false

		var me = this;
		list.setDisableSelection(false)
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.setDisableSelection(true)
					del(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
					list.setDisableSelection(true)
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteAccnt.php',
			    params: {
					accntID: rec.data.accntID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Accnt').remove(rec);
					}		         
			    }
			});
		}
	},	

	accntAddnew: function(accntType,win){		
		var me = this;
		switch(accntType){
		case '一对一':
			me.accntaddnew = Ext.create('Youngshine.view.accnt.AddnewKclistOne2one');
			me.accntaddnew.down('list').getStore().removeAll()
			// 当前学校的课时套餐价格表
			var params = {
				"kcType": '一对一',
				"schoolID": localStorage.schoolID,
				"current": 1 //禁用的一对一课程不显示
			}	
			console.log(params)	
			var store = Ext.getStore('Kclist'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(params));
			store.load({
				callback: function(records, operation, success){
					console.log(records)
				}   		
			});	 
			break;
		case '大小班':
			me.accntaddnew = Ext.create('Youngshine.view.accnt.AddnewKclistClass');
			me.accntaddnew.down('list').getStore().removeAll()
			// 当前学校的大小班课程
			var objClass = {
				"kcType": '大小班',
				"schoolID": localStorage.schoolID,
				"schoolsubID": localStorage.schoolsubID,
				//"consultID": localStorage.consultID //咨询师的大小班
				"current": 1 //禁用的大小班课程不显示
			}		
			var store = Ext.getStore('Kclist'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(objClass));
			store.load({
				callback: function(records, operation, success){
					console.log(records)
				}   		
			});	
			break;
		case '退费退班':
			me.accntaddnew = Ext.create('Youngshine.view.accnt.AddnewRefund');
			me.accntaddnew.down('list').getStore().removeAll()
			break;
			// 当前学校的大小班课程
			/*
			var objClass = {
				"kcType": '退班退费',
				"schoolID": localStorage.schoolID,
				"schoolsubID": localStorage.schoolsubID,
				//"consultID": localStorage.consultID //咨询师的大小班
				"current": 1 //禁用的大小班课程不显示
			}		
			var store = Ext.getStore('Kclist'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(objClass));
			store.load({
				callback: function(records, operation, success){
					console.log(records)
				}   		
			});	 */
		}
		Ext.Viewport.add(me.accntaddnew)
		Ext.Viewport.setActiveItem(me.accntaddnew)
	},
	
	/* 取消添加
	accntaddnew1to1Cancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.accntaddnew1to1,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.accnt);
	},	
	accntaddnew1to1Save: function( obj,oldView )	{
    	var me = this; console.log(obj)

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.data.JsonP.request({
				    url: me.getApplication().dataUrl + 'createAccnt.php',
				    params: {
						data: JSON.stringify(obj)
					},
				    success: function(result){
						//oldView.destroy(); console.log(result)
						Ext.Viewport.remove(me.accntaddnew,true)
						Ext.Viewport.setActiveItem(me.accnt);
						obj.accntID = result.data.accntID
						obj.created = '刚刚';
						Ext.getStore('Accnt').insert(0,obj)					
				    }
				});
			}
		});	
	}, */
	// 取消添加
	accntaddnewCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.accntaddnewclass,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.accnt);
	},	
	
	// 保存：accntType:一对一、大小班、退费退班 
	accntaddnewSave: function( obj,oldView )	{
    	var me = this; console.log(obj)
		// 传递参数，带有数组（子表多条记录）
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'createAccntAndDetail.php',
		    params: obj,
		    success: function(response){ 
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				console.log(ret.data.accntID);
				obj.accntID = ret.data.accntID
				//obj.created = '刚刚';
				Ext.getStore('Accnt').insert(0,obj)	
				
				Ext.Viewport.remove(me.accntaddnew,true)
				Ext.Viewport.setActiveItem(me.accnt);
				
				// 发送模版消息：电子收据
				wxTpl(obj); 

				function wxTpl(person){
					var objWx = {
						wxID       : person.wxID, // 发消息学生家长
						student    : person.studentName,
						accntID    : person.accntID,
						accntType  : person.accntType,
						accntDate  : person.accntDate,
						amount     : person.amount,
						amount_ys  : person.amount_ys,
						school     : localStorage.schoolName
					}
					console.log(objWx)
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl+'weixinJS_gongzhonghao/wx_msg_tpl_accnt.php',
					    params: objWx,
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							console.log(text)//JSON.parse
					    }
					});
				} // 模版消息end
				
				/* php 后台无法处理，数组arrClassess???
				if(obj.accntType == '大小班'){
					//往class_student表，添加报读的班级，直接在后台php处理？？？
					var objClasses = {
						accntID: obj.accntID,
						studentID: obj.studentID,
						classID: obj.arrClasses['classID'],
					}
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl + 'createClassStudent.php',
					    params: obj.arrClasses,
					    success: function(response){
					    	
					    }
					})
				}	*/		
		    }
		});
	},
	// 查找选择购买的学生（全校）
	accntaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.accnt.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示
		me.student.show();
		me.student.getStore().removeAll(); //该store内容可能存在，比如打开过学生菜单
/*
		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID 
			//必须带上校区，否则公众号学生没归属咨询师
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudentListByAll.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        if (success){
					console.log(records)
					me.student.show(); //showBy(btn); // overlay show
				};
			}   		
		});	
*/		
		var obj = {
			"schoolID" : localStorage.schoolID 
		}	
		console.log(obj)	
		var store = Ext.getStore('Schoolsub'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readSchoolsubList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        if (success){
					console.log(records)
				};
			}   		
		});	
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.accntaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName)
		me.accntaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
		// 发微信模版消息用
		me.accntaddnew.down('hiddenfield[name=wxID]').setValue(record.data.wxID)
	},
	
	// 查找选择购买大小班
	accntaddnewKclistClass: function(btn)	{
    	var me = this; 
		me.kclist = Ext.create('Youngshine.view.accnt.KclistClass');
		Ext.Viewport.add(me.kclist); //否则build后无法显示
		me.kclist.show();	//overlay
		
		me.kclist.getStore().clearFilter()
	},
	//
	kclistclassItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		
		var obj = {
			kclistID: record.data.kclistID,
			title: record.data.title,
			hour: record.data.hour,
			unitprice: 0, // 大小班，没有单价
			amount: record.data.amount,
		}
		console.log(obj); 
		
		list.getStore().removeAt(index); // 移除选中的
		
		var store = me.accntaddnew.down('list').getStore();
		store.insert(0,obj); //新增记录，排在最前面
		//Ext.getStore('Classes').remove(record) //选中的移除消失
		// 金额累加
		var ys = me.accntaddnew.down('numberfield[name=amount_ys]'),
			ss = me.accntaddnew.down('numberfield[name=amount]')
		var amt = parseInt(record.data.amount)
		ys.setValue(ys.getValue()+amt)
		ss.setValue(ss.getValue()+amt)
	},
	
	///* 查找选择校区的课时套餐价格
	accntaddnewKclistOne2one: function(btn)	{
    	var me = this; 
		me.kclist = Ext.create('Youngshine.view.accnt.KclistOne2one');
		Ext.Viewport.add(me.kclist); //否则build后无法显示
		me.kclist.show();
	},
	kclistone2oneDone: function(obj,oldView){
    	var me = this; 
		var store = me.accntaddnew.down('list').getStore();
		store.insert(0,obj); //新增记录，排在最前面
		//Ext.getStore('Classes').remove(record) //选中的移除消失
		// 金额累加
		var ys = me.accntaddnew.down('numberfield[name=amount_ys]'),
			ss = me.accntaddnew.down('numberfield[name=amount]')
		var amt = parseInt(obj.amount)
		ys.setValue(ys.getValue()+amt)
		ss.setValue(ss.getValue()+amt)
	},
	
	// 退费已经购买的一对一课程或大小班课程（并且退班）
	// 尚未分班或一对一排课 isClass=9 才能显示出来
	accntaddnewKclistRefund: function(obj,btn)	{
    	var me = this;  console.log(obj)
		if(obj.accntType == '大小班'){
			//me.kclist = Ext.create('Youngshine.view.accnt.KclistRefundClass');
		}else if(obj.accntType == '一对一'){
			//me.kclist = Ext.create('Youngshine.view.accnt.KclistRefundOne2one');
		}
		me.kclist = Ext.create('Youngshine.view.accnt.KclistRefund');
		Ext.Viewport.add(me.kclist); //否则build后无法显示
		//me.kclist.show();

		var store = Ext.getStore('AccntDetail'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAccntDetailListByRefund.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        if (success){
					console.log(records)
					me.kclist.show(); //showBy(btn); // overlay show
				};
			}   		
		});	
	},
	//
	kclistrefundItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 		
		var obj = {
			accntdetailID: record.data.accntdetailID,
			kclistID: record.data.kclistID,
			kcType: record.data.kcType,
			title: record.data.title,
			hour: record.data.hour,
			unitprice: record.data.unitprice, // 大小班，没有单价
			amount: record.data.amount,
		}
		console.log(obj); 
		
		list.getStore().removeAt(index); // 移除选中的
		
		var store = me.accntaddnew.down('list').getStore();
		store.insert(0,obj); //新增记录，排在最前面
		//Ext.getStore('Classes').remove(record) //选中的移除消失
		// 金额累加
		var ss = me.accntaddnew.down('numberfield[name=amount]')
		var amt = parseInt(record.data.amount)
		ss.setValue(ss.getValue()+amt)
	},
	
	// 显示课时套餐的报读课程知识点记录
	accntItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(record)

		me.accntdetail = Ext.create('Youngshine.view.accnt.Detail')
		Ext.Viewport.add(me.accntdetail)

		// 预先加载的数据
		var params = {
			"accntID": record.data.accntID,
		}
		var store = Ext.getStore('AccntDetail'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readAccntDetailListByAccnt.php?data='+JSON.stringify(params) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
					var content = ''
					Ext.Array.each(records, function(name, index) {
						console.log(name)
						content += name.data.title + '<br>' + 
							'<span style="font-size:0.8em;color:#888;">' + 
							name.data.hour + '课时' +
							name.data.amount + '元' + '</span><br>'
					});		
					console.log(content) 
					var obj = {
						content: content
					}
					me.accntdetail.down('panel[itemId=my_show]').setData(obj)
					me.accntdetail.show()
				};
			}   		
		});	
	}, 
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('accnt controller init');
	}
});
