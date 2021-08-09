//Error handler middleware
function errorHandler (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send('Invalid ID provided');
  } else {
    res.status(500).send(err.message);
  }
}

module.exports = { errorHandler };