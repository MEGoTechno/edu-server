const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()
const SECRETJWT = process.env.SECRETJWT


const generateToken = ({id})=> {
    const data = jwt.sign({ userId: id }, SECRETJWT, {
        expiresIn: "30d"
    });
    
    let token = "Bearer " + data
    return token
}

module.exports = {generateToken}