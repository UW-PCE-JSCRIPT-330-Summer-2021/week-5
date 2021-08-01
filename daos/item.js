const Item = require('../models/item');

module.exports = {};




module.exports.updateItem = async (itemId, item) => {
    const itemFromDB  = await Item.findOne({ _id: itemId}).lean();
    if(!itemFromDB){
        throw new Error('Not found');
    } 
    return  await Item.updateOne({ _id: itemId }, {$set: {'price': item.price}});
}

module.exports.createItem = async (item) => {
  return await Item.create(item);
}

module.exports.getItem = async (id) => {
    return await Item.findOne({_id:id}).lean();
  }


  module.exports.getItems = async () => {
    return await Item.find({}).lean();
  }
