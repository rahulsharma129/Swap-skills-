const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login");
        }
        const decodedObj = await jwt.verify(token, "DEV@Tinder0459");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.banned) {
            throw new Error("User is banned");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
};

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("Admin access required");
    }
};

module.exports = { userAuth, adminAuth };