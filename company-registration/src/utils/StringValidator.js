import axios from "axios";

class StringValidator {

    validateEmail = (email) => {
        if (email.length < 1) {
            return "Please enter your contact email."
        }
        if (!String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {return "Invalid email format!"}
        
    };

    validateUsername = (username) => {
        if ( username.length < 5 || username.length > 18) {
            return 'Username should be between 5 to 18 characters long!'
        }
        if (!String(username).match( /^[a-zA-Z0-9_\.]+$/)) {
            return "Username cannot contain special character, only '_' and '.' are allowed!"
        }
        
    };

    validateFullname = (fullname) => {
        if (fullname.length < 1) {
            return "Please enter your full name."
        }
        if (!String(fullname).toLowerCase().match(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$$/)){
            return "Full name cannot contain special character and must contain first name and last name!"
        }
    };

    validateCompanyCode = (companyCode) => {
        if (companyCode.length < 3 || companyCode.length > 10) {
            return "Company code should be between 3 to 10 characters long."
        }
        if (!String(companyCode).match(/^[a-zA-Z0-9\-]+$/)) {
            return "Company code can only contain english alphabeth, number and hyphen('-')."
        }
        
    };

    validateCompanyName = (companyName) => {
        console.log(String(companyName).match(/^[a-zA-Z0-9\- ]+$/ ))
        if (companyName.length < 3 || companyName.length > 20) {
            return "Company name should be between 3 to 20 characters long."
        }
        if (!String(companyName).match(/^[a-zA-Z0-9\- ]+$/ )) {
            return "Company name can only contain english alphabeth, number, white-space and hyphen('-')."
        }
    };

    validateWalletPublicKey = (key) => {
        var pref = new RegExp('^'+'0x')
        if (key.length != 42 || !pref.test(key) || !String(key).match(/^[a-zA-Z0-9]+$/)){
            return "Wallet public key must be 40 characters long with additional 'Ox' prefix and contains only English alphabet and number."}
    };

    validateTxnHash = (key) => {
        var pref = new RegExp('^'+'0x')
        if (key.length != 66 || !pref.test(key) || !String(key).match(/^[a-zA-Z0-9]+$/)){
            return "Transaction hash must be 62 characters long with additional 'Ox' prefix and contains only English alphabet and number."}
    };

    validateWalletPrivateKey = (key) => {
        if (key.length != 64 || !String(key).match(/^[a-zA-Z0-9]+$/))
         {return "Wallet private key must be 64 characters long and contains only English alphabet and number."}
    };

    validatePassword = (password, confirmPassword) => {
        if ( password.length < 5) {
            return "Password should be at least 6 characters."
        } else if (confirmPassword != password)  {
            return "Passwords are not matching!"
        } 
    }

    validateNodeCode = (nodeCode) => {
        if ( nodeCode.length < 3 || nodeCode.length > 10) {
            return "Node code should be between 3 to 10 characters long."
        }
        if (!String(nodeCode).match(/^[a-zA-Z0-9\- ]+$/ )) {
            return "Node code can only contain english alphabeth, number, white-space and hyphen('-')."
        }
    }

    validateAddress = (address) => {
        if ( address.length < 1) {
            return "Please enter node address and zipcode."
        }
    }

    validatePhoneNumber = (phoneNumber) => {
        if ( phoneNumber.length < 1) {
            return "Please enter node contact number."
        }
        if (!String(phoneNumber).match(/^[0-9+]+$/ )) {
            return "Phone number can only contain number and '+' sign."
        }
    }

    validateShipmentDescription = (description) => {
        if ( description.length < 1) {
            return "Please enter shipment description."
        }
    }
}

export default new StringValidator()