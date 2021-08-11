//error handling middleware
//used to handle errors where the provided id is not a valid objectId
const errorHandler = (err, req, res, next) => {
    try {
        //if error is that there is no valid objectId
        if (err.message.includes("Cast to ObjectId failed")) {
            //should send 400
            res.sendStatus(400);
        }
        else {
            //should send 500 and the error message
            res.status(500).send(err.message);
        }
    }
    catch (e) {
        next(e);
    }
};

module.exports = { errorHandler };