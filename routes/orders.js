const { Router } = require("express")
const router = Router();

const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/authorization');
const { errorHandler } = require('../middleware/errorHandler');

//Create: POST /orders
//open to all users
//isAuthorized: checks to see if user has authorization
router.post("/", isAuthorized, async (req, res, next) => {
    const itemsList = req.body;
    const userId = req.userInfo._id;
    try {
        //variable that contains the total of the order
        let total = 0;
        //for loop that goes through the array list of items
        for (let i = 0; i < itemsList.length; i++) {
            //one item is taken at a time
            const item = await itemDAO.getOneItem(itemsList[i]);
            //if an item isn't taken
            if (!item) {
                //should send 400
                return res.sendStatus(400);
            } else {
                //else, an item's price is calculated within the total of the order
                total = total + item.price;
            }
      }
      //a new order is created using the userId, items, and total of the order
      const newOrder = await orderDAO.createOrder({ userId: userId, items: itemsList, total: total });
      //should send 200, and send the new order information
      res.status(200).send(newOrder);
    } catch (e) {
      next(e);
    }
  });


//Get my orders: GET /orders
//return all the orders made by the user making the request
//isAuthorized: checks to see if user has authorization
//isAdmin: checks to see if user has admin status
router.get("/", isAuthorized, isAdmin, async (req, res, next) => {
    const userId = req.userInfo._id;
    try {
        //checks to see if user who made request is an admin
        if (req.isAdmin) {
            //get all orders
            const orders = await orderDAO.getOrders();
            //should send 200 and the orders
            res.status(200).send(orders);
        }
        else {
            //get an order by the user who made it
            const userOrder = await orderDAO.getOrderByUser(userId);
            //should send 200 and the order of the user who made it
            res.status(200).send(userOrder);
        }
    }
    catch (e) {
        next(e);
    }
});

//Get an order: GET /order/:id
//return an order with the items array containing the full item objects
//isAuthorized: checks to see if user has authorization
//isAdmin: checks to see if user has admin status
router.get("/:id", isAuthorized, isAdmin, async (req, res, next) => {
    const orderId = req.params.id;
    const userId = req.userInfo._id;
    try {
        //get an order by the order id
        const order = await orderDAO.getOrderById(orderId);
        //checks to see if user who made request is an admin or their userId matches the userId of the order
        if (req.isAdmin || userId == order.userId) {
            //should send 200 and the order
            res.status(200).send(order);
        }
        else {
            //should send 404
            res.sendStatus(404);
        }
    }
    catch (e) {
        next(e);
    }
});

//error handling middleware
router.use(errorHandler);

module.exports = router;