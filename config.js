const { default: mongoose } = require("mongoose")

const PORT = 3000
const JWT_USER_SECRET = "manojseetarm"
const JWT_ADMIN_SECRET = "ramram"

const MONGO_URL = "mongodb://localhost:27017"

module.exports={
    JWT_USER_SECRET,
    JWT_ADMIN_SECRET,
    MONGO_URL,
    PORT
}