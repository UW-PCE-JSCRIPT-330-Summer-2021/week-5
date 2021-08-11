const mongoose = require('mongoose');
const { update } = require('../models/item');

const Item = require('../models/item');

module.exports = {};

module.exports.getById = async (itemId) => {
  //  if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return null;
  // }
  return Item.findById( itemId ).lean();
}
  
module.exports.getAll = async (query) => {
  return Item.find(query).lean();
}

module.exports.getByIds = async (itemData) => {

  const query = { _id: { $in: itemData }};
  return module.exports.getAll(query);
    //Group by for user
  let group = {
      $group: {
        _id: "$_id",
        total: { $sum: '$price' }
      }
    };


  const totalQuery = { total: { $sum: '$price' }};
  const projectQuery = {_id: 0, itemId: '$_id', total: { $sum: '$price' }};
                   
  // let query = [whereData, group];  
  // return Item.find(whereData);
  return (Item.find(matchItems));
  // return (Item.aggregate().match(matchItems).project(projectQuery).unwind('tags'));

  // project is for order
  // let project = { $project: { 
  //   _id: 0, 
  //   item: 1,
  //   itemId: "$_id",
  //   total: 1,
  //   }
  // };
  
//   let lookup;
//   let query = [group, project];  

//   if (userData) {
//     lookup = { $lookup: {
//       from: 'user',
//       localField: 'userId',       
//       foreignField: '_id',       
//       as: 'user'}
//     };
//     query.push(lookup);
//     query.push({ $unwind: '$user'});
//   }
//   return Order.aggregate(query);
}
  
module.exports.create = async (itemData) => {
  try {
    const created = Item.create(itemData);
    return created;
  } catch (e) {
    if (e.message.includes('validation failed') || e.message.includes('duplicate key')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}
module.exports.updateById = async (itemData) => {
  
  if (!mongoose.Types.ObjectId.isValid(itemData._id)) {
    return null;
  }
  const updated = Item.updateOne(itemData);
  return updated;
}

class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;