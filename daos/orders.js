const Order = require('../models/order');

const itemDAO = require('./items');
const userDAO = require('./user');

module.exports.createOrder = async (order) => {
  try {
    const sum = await order.items.reduce(async (pSum, item) => {
      const sum = await pSum;
      let price;

      try {
        price = (await itemDAO.getItemById(item)).price;
      } catch {
        throw new Error('Bad Item');
      }

      return sum + price;
    }, 0);

    order.total = sum;
    const createdOrder = await Order.create(order);
    return createdOrder;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports.getOrderById = async (order_id) => {
  try {
    const foundOrder = await Order.findOne({ _id: order_id }).lean();

    let foundItems = [];
    for (let idx = 0; idx < foundOrder.items.length; idx++) {
      const foundItem = await itemDAO.getItemById(foundOrder.items[idx]);
      const item = {
        title: foundItem.title,
        price: foundItem.price,
      };

      foundItems.push(item);
    }

    foundOrder.items = foundItems;
    return foundOrder;
  } catch (e) {
    throw new Error(`Order ${order_id} not found`);
  }
};

module.exports.getUserOrders = async (user_id) => {
  try {
    const foundOrder = await Order.find({ userId: user_id }).lean();
    return foundOrder;
  } catch (e) {
    throw new Error(`No orders for user ${user_id}`);
  }
};

module.exports.getAllOrders = async () => {
  try {
    const foundOrders = await Order.find().lean();
    return foundOrders;
  } catch (e) {
    throw new Error(e.message);
  }
};
