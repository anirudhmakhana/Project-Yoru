const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

let coordinate = new Schema ({
    lat : {
        type:Number
    },
    lng : {
        type:Number
    }
})

let staffSchema = new Schema ({
    firstName : {
        type:String
    },
    lastName : {
        type:String
    },
    walletAddress : {
        type:String
    }
})

let distCenterSchema = new Schema ({
    code : {
        type:String
    },
    name : {
        type:String
    },
    coordinate : {
        type:coordinate
    }, 
    address : {
        type:String
    },
    zipCode : {
        type:String
    },
    contactNumber : {
        type: String
    }
})

let companySchema = new Schema ( {
    companyName : {
        type: String
    },
    staffs: [{
        type: staffSchema
    }],
    distCenters: [{
        type: distCenterSchema
    }], 
    managerContact: {     //manager phone number (who has responsibility of)
        type: String
    },
    collection: "companies"
    }
)

module.exports = mongoose.model('Company', companySchema);
