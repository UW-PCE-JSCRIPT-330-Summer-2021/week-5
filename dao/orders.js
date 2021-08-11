const Order = require('../models/order');
const Item = require('../models/item');
module.exports = {};

module.exports.createOrder = async (itemsId, userId) => {
  let total = 0;
  for( const id of itemsId){
    const item =  await Item.findOne({ _id: id }).lean();
    if(!item){
      throw new Error('Not found');
    }
    total += item.price;
  }
  const order = {
    userId: userId,
    items: itemsId,
    total: total
  }
  return await Order.create(order);
}

module.exports.getByOrderIdUserId = async (userId, orderId) => {
    const order = await Order.findOne({_id: orderId, userId: userId }).lean();
    if (!order) {
     return null;
  }
    let items = [];
    const itemsIds = order.items;
    for( const id of itemsId){
      const item =  await Item.findOne({ _id: id }).lean();
      if(!item){
        throw (e) ('Not found');
      }
      items.push(item);
    }
    order.items = items;
    return order;
  }

  module.exports.getOrderByUserId = async (userId) => {
    const order = await Order.find({userId: userId }).lean();
    if (!order) {
     return null;
  }
    return order;
  }


  module.exports.getOrderById = async (orderId) => {
    const order = await Order.findOne({_id: orderId}).lean();
    if (!order) {
     return null;
  }
    let items = [];
    const itemsId = order.items;
    for( const id of itemsId){
      const item =  await Item.findOne({ _id: id }).lean();
      if(!item){
        throw new Error('Not found');
      }
      items.push(item);
    }
    order.items = items;
    return order;
  }


  module.exports.getOrders= async () => {
    const orders = await Order.find({}).lean();
    if (!orders) {
     return null;
  }
    return orders;
  } 
