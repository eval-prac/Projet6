
/**
 * Configuration setup for token security
 */
const jsonwebtoken = require("jsonwebtoken");

const auth = (req, resp, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenDecoded = jsonwebtoken.verify(token, "key2000");
        const userID = tokenDecoded.userId;
        if (req.header.userId && req.header.userId!==userId) {
            throw new Error("Invalid user ID");
        }
        req.userId=userID; 
        next();
    } catch (ex) {
        return resp.status("401").json({ "message":ex.stack });
    }
}

module.exports=auth;
