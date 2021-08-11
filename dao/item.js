const Item = require('../models/item');


module.exports = {};

module.exports.createItem = async (item) => {
  return await Item.create(item);
}

module.exports.updateItem = async (itemId, item) => {
    const itemFromDataBase  = await Item.findOne({ _id: itemId}).lean();
    if(!itemFromDataBase){
        throw (e) ('Item from DataBase Not found');
    } 
    return  await Item.updateOne({ _id: itemId }, {$set: {'price': item.price}});
}

module.exports.getItem = async (id) => {
    const item = await Item.findOne({_id:id}).lean();
    return item;
  }
module.exports.getItems = async () => {
    return await Item.find({}).lean();
  }
