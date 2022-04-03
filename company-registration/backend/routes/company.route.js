let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router()
const   createError = require('http-errors');

let companySchema = require("../models/Company")

router.route('/create-company').post((req, res, next) => {
    companySchema.create(req.body, (error, data) => {
        if (error ) {
            return next(error);
        }
        else {
            console.log(data);
            res.json(data);
        }
    })
})

// Read companies
router.route("/").get((req, res) => {
    companySchema.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    } )
})

// Get single company
router.route("/get-company/:id").get((req,res) => {
     companySchema.findById(req.params.id, (error, data) => {
         if (error) {
             return next(error);
         } else {
             res.json(data);
         }
     })
})

// Find company by account
router.route("/get-company-by-account/:acckey").get((req, res) => {
    companySchema.findOne({publicKeys:{$elemMatch: {$eq:　req.params.acckey}}}, (error, data ) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    })
})

// Add account
router.route("/add-account/:id").put((req, res, next) => {
    companySchema.findByIdAndUpdate(req.params.id, {
        $push: {
            publicKeys: req.body.publicKey
        }
    }, (error, data) => {
        if (error ) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
            console.log("Account added successfully")
        }
    })
})

//

// Update company
router.route('/update-company/:id').put((req, res, next) => {
    companySchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error ) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
            console.log("Company updated successfully")
        }
    })
})

// Delete company
router.route('/delete-company/:id').delete((req, res, next ) => {
    companySchema.findByIdAndRemove( req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json ({
                msg: data
            })
        }
    })
})

module.exports = router;