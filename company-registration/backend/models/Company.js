const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let companySchema = new Schema ( {
    companyName : {
        type: String
    },
    publicKeys: [{
        type: String
    }]
}, {
    collection: "companies"
}
)

module.exports = mongoose.model('Company', companySchema);
