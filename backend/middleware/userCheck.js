const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.auth;
	console.log("Token middleware: ");
        console.log(token);
        const userdata = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = userdata;
        if (userdata.is_admin === 1) {
            req.admin = true;
            next();
        } else {
            req.admin = false;
            next();
        }
    } catch (error) {
        req.user = {
            username: undefined
        }
        next();
    }
};
