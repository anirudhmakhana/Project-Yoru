require('dotenv').config({path:'../.env'})
const { REACT_APP_DB_URI} = process.env

module.exports = {
    db: REACT_APP_DB_URI
}