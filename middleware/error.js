function errorResponse (err, req, res, next) {

    try {
        if(err.message.includes('duplicate'))
        {
            res.status(409).send(err.message);
        } else if(
            err.message.includes('required') ||
            err.message.includes('Bad Item'))
        {
            res.status(400).send(err.message);
        } else if(
            err.message.includes('User not found') || 
            err.message.includes('Passwords do not match') || 
            err.message.includes('logged in') ||
            err.message.includes('Bad Token') ||
            err.message.includes('malformed'))
        {
            res.status(401).send(err.message);  
        } else if(
            err.message.includes('Unauthorized') ||
            err.message.includes('Route not defined'))
        {
            res.status(404).send(err.message);
        } else if(err.message.includes('Access Denied')) {
            res.status(403).send('User not authorized to access this content')
        } else {
            res.status(500).send(err.message);
        }
    } catch {
        res.status(504).send('Service Unavailable');
    }
};

module.exports = errorResponse;