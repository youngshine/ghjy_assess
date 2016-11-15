// 查找选择课时套餐
Ext.define('Youngshine.view.orders.Pricelist',{
	extend: 'Ext.dataview.List',
	xtype: 'orders-pricelist',

	config: {
		striped: true,
		store: 'Pricelist',
		itemTpl: '<div>{title}</div>',
        // We give it a left and top property to make it floating by default
        //right: 0,
        //top: 0,
		width: 400,height: '75%',
		border: 5,
		style: 'border-color: black; border-style: solid;',

        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: true,

        // Make it hidden by default
        hidden: true,
        scrollable: true,

	},


});