import axios from "axios";

class StringValidator {

    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    validateUsername = (username) => {
        return String(username)
            .match(
                /^[a-zA-Z0-9_\.]+$/
            );
    };

    validateFullname = (fullname) => {
        return String(fullname)
            .toLowerCase()
            .match(
            /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$$/
            );
    };
}

export default new StringValidator()