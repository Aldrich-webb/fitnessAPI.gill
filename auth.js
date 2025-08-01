const jwt = require("jsonwebtoken");

const secret = "FitnessTrackerAppSecret";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed. No Token Provided." });
    } else {
        token = token.slice(7, token.length);

        if (token.length === 0) {
            return res.status(401).send({ auth: "Failed. No Token Provided." });
        }

        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(401).send({
                    auth: "Failed.",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
};