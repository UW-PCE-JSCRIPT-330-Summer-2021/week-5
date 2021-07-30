const Item = require('../models/item')

module.exports = {}

module.exports.createItem = async (itemObj) => {
    const item = await Item.create(itemObj)
    return item
}

module.exports.getItem = async (_id) => {
    return await Item.findOne({ _id }).lean()
}

module.exports.getAllItems = async () => {
    return await Item.find().lean()
}

module.exports.updateItem = async (itemId, newObj) => {
    try {
        await Item.updateOne({ _id: itemId }, newObj)
        return true
    }
    catch (e) {
        res.status(500).send(e.message)
    }
}