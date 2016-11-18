Ext.define('Youngshine.view.Menu', {
	extend: 'Ext.Menu',
	xtype: 'sidemenu',	
	//id: 'mypopmenu',
	
	config: {
		width: '50%',
		//scrollable: 'vertical',
		items: [{
			text: '根号教育',
			ui: 'plain',
			style: {
				color: '#fff',
				'font-size': '0.8em'
			},
			action: 'school'
		},{	
			text: '咨询首页',
			iconCls: 'home',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onHome()
			}
		},{
			text: '学生',
			iconCls: 'user',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onStudent()
			}
		},{
			text: '退出',
			iconCls: 'action',
			handler: function(btn){
				Ext.Viewport.removeMenu('left');
				Youngshine.app.getController('Main').logout()
			}
		}],
	},

	initialize: function(){
		this.callParent(arguments)
		this.on('hide',this.onHidemenu)
	},
	onHidemenu: function(){
		this.destroy()
	},

	onHome: function(){
		this.fireEvent('home')
	},	
	onStudent: function(){
		this.fireEvent('student')
	},
	onTeacher: function(){
		this.fireEvent('teacher')
	},
	onAssess: function(){
		this.fireEvent('assess') //测评，报名前
	},
	onOrders: function(){
		this.fireEvent('orders') //购买课时套餐
	},
	onOne2onePk: function(){
		this.fireEvent('one2onePk') //一对一排课：安排学习内容及教师
	},
	onClassesPk: function(){
		this.fireEvent('classesPk') //大小班课程排班，拉入学生、任课教师、时间
	},
	onKcb: function(){
		this.fireEvent('kcb') //安排课程及教师
	},
	onClasses: function(){
		this.fireEvent('classes') //大小班级 instead of 一对一
	},
	onPricelist: function(){
		this.fireEvent('pricelist') //课时套餐的校区价格设置
	},
	onAccnt: function(){
		this.fireEvent('accnt') //报读（大小班、一对一）缴费
	},
});	
	