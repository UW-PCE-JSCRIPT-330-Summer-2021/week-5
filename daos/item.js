const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

//Create: POST /items - restricted to users with the "admin" role
module.exports.createItem = async (itemObj) => {
    //create an item object
    const created = await Item.create(itemObj);
    return created;
};

//Update a note: PUT /items/:id - restricted to users with the "admin" role
module.exports.updateItem = async (itemId, itemObj) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return false;
    }
    //update an item using their itemId and the itemObj
    await Item.updateOne({ _id: itemId }, itemObj);
    return true;
};

//Get all items: GET /items - open to all users
module.exports.getItems = async () => {
    //find all items
    return await Item.find().lean();
};

// get one item
module.exports.getOneItem = async (itemId) => {
    //find one item
    return await Item.findOne({ _id: itemId });
};