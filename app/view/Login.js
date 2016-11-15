Ext.define('Youngshine.view.Login', {
    extend: 'Ext.form.FormPanel',
    xtype: 'login',
	
    config: {
    	items: [{
    		xtype: 'fieldset',
			title: '<div style="color:#888;">根号教育 － 咨询测评</div>',
			style: {
				width: '410px',
				maxWidth: '480px',
				margin: '80px auto 0'
			},
			defaults: {
				xtype: 'textfield',
				clearIcon: false,
				labelWidth: 85,
			},
    		items: [{
				itemId: 'username',
    			label: '账号',
    		},{
    			xtype : 'passwordfield',
				itemId : 'psw',
				label : '密码',
				value: '123456',
			},{
				itemId: 'school',
    			label: '学校',
				placeHolder: '输入联盟学校名称'
    		}]
    	},{
			xtype: 'button',
			//margin:-10px 10px',
			text : '登录', 
			ui : 'plain',
			action: 'login',
			style: {
				color: '#fff',
				background: '#66cc00',
				//border: '1px solid #9d9d9d'
				margin: '15px auto',
				maxWidth: '474px',
				width: '404px'
			}
		}],
    	
    	listeners: [{
    		delegate: 'button[action=login]',
    		event: 'tap',
    		fn: 'onLogin'
    	},{
    		element: 'element', //忘记密码 <a>超链接，属于dom
			delegate: 'div.forgetpassword',
			event: 'tap',
			fn: 'onForgetpassword'				
		}]
    },
    
	// 控制器Main
    onLogin: function(){
    	// 带入参数：当前表单的用户名和密码
    	var username = this.down('textfield[itemId=username]').getValue().trim(),
			psw = this.down('textfield[itemId=psw]').getValue().trim(),
			school = this.down('textfield[itemId=school]').getValue().trim();
		//console.log(school+username+psw)
		//if (schoolID==null || schoolID==''){
		if (school==null || school==''){
			Ext.toast('请输入加盟校区',3000); return;
		}
		if (username==''){
			Ext.toast('请输入账号',3000); return;
		}
		if (psw.length<6){
			Ext.toast('密码至少6位',3000); return;
		}	

    	this.fireEvent('ok', username,psw,school);		
    },	
	
	// 初始化，cookie
    initialize: function() {
        this.callParent();
		this.on({
            scope: this,
            painted: 'onPainted',
        });
    },
    onPainted: function() {
		this.down('textfield[itemId=username]').setValue(localStorage.consultName)
		this.down('textfield[itemId=school]').setValue(localStorage.schoolName)
    },
});