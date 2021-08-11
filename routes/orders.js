const { Router } = require('express');
const router = Router({ mergeParams: true });

const orderDAO = require('../daos/orders');


const isTokenValid = require('../middleware/authentication');

router.use(async (req, res, next) => {
	isTokenValid(req, res, next);
});

// POST 

router.post('/', async (req, res, next) => {
	const userId = req.user._id;
	const itemIds = req.body;
	if (!itemIds) {
		res.sendStatus(404).send('Items not found');
		return;
	}
	try {
		const postedOrders = await orderDAO.createOrder(itemIds, userId);
		if (!postedOrders) {
			res.sendStatus(404).send('Order not found');
			return;
		}
		res.json(postedOrders);
	} catch (e) {
		next(e);
	}
});

// GET 

router.get('/', async (req, res, next) => {
	if (!req.user.admin) {
		const orderForUser = await orderDAO.getOrderByUserId(req.user._id);
		if (!orderForUser) {
			res.status(400).send('not found');
		}
		res.json(orderForUser);
	} else {
		const orders = await orderDAO.getAllOrders();
		if (!orders) {
			res.status(400).send('not found');
		}
		res.json(orders);
	}
});
// GET 

router.get('/:id', async (req, res, next) => {
	let orderId = req.params.id;
	if (req.user.admin) {
		const orderForAdmin = await orderDAO.getOrderByOrderId(orderId);
		if (!orderForAdmin) {
			res.status(400).send('not found');
		}
		res.json(orderForAdmin);
	} else {
		const order = await orderDAO.getByOrderIdUserId(req.user._id, orderId);
		if (!order) {
			res.sendStatus(404);
			return;
		} else {
			res.json(order);
		}
	}
});

router.use(function (err, req, res, next) {
	if (err.message.includes('Not found')) {
		res.status(400).send('Invalid id provided');
	} else if (err.message.includes('Item for user not found')) {
		res.status(404).send('Object not found');
	} else {
		res.status(500).send('Server error');
	}
});

module.exports = router;
