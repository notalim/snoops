import { ObjectId } from "mongodb";
import * as Validator from "email-validator"; //Yousaf - Url: https://www.npmjs.com/package/email-validator
import validator from "validator"; //Yousaf - Url: https://www.npmjs.com/package/validator
//Yousaf - We can prolly just use validator to handle both email and website

export function checkString(str, strName) {
    if (!str) {
        throw `You must provide a ${strName}`;
    }
    if (typeof str !== "string") {
        throw `${strName} must be a string`;
    }
    if (str.trim().length === 0) {
        throw `${strName} can not be an empty string or a string with just spaces`;
    }
    str = str.trim();
    return str;
}
export function checkNumber(num, numName) {
    if (!num) {
        throw `You must provide a ${numName}`;
    }
    if (typeof num !== "number") {
        throw `${numName} must be a number`;
    }
    if (isNaN(num)) {
        throw `${numName} cannot be NaN`;
    }
    return num;
}
export function checkStringArray(arr, arrName) {
    if (!arr) {
        throw `You must provide a ${arrName}`;
    }
    if (!Array.isArray(arr) || arr.length === 0) {
        throw `${arrName} must be a non-empty array`;
    }
    for (let elm of arr) {
        elm = checkString(elm, arrName + " element");
    }
    return arr;
}

export function checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") {
        throw `Error:${varName} must be a string`;
    }
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
}

export function checkPassword(password, elmName) {
    password = checkString(password, elmName);
    //Yousaf - Find password validating function in validator (NPM link at the top)
}

export function checkWebsite(website, elmName) {
    //Yousaf - Found validator on NPM
    website = checkString(website, elmName);
    if (!validator.isURL(website)) {
        throw `${elmName} must be a valid URL`;
    }
    return website.trim();
}

export function checkEmail(email, elmName) {
    //Yousaf - Found package email-validator on npm, has like 600k downloads a week.
    //         I can do some testing with it later tho to check if it actually works
    //         If yall find anything else cool lmk
    email = checkString(email, elmName);
    if (!Validator.validate(email)) {
        throw `You must provide a valid email`;
    }
    return email.trim();
}

export function checkGender(gender, elmName) {
    // gender = checkString(gender, elmName);
    if (!(gender === "M" || gender === "F")) {
        throw `Invalid value for ${elmName}`;
    }
    return gender;
}

export function checkWorkingHours(workingHours, elmName) {}
/*Yousaf - I dont think we need this cuz we check if the var exists in each 
           validation function since a lot of the functions use checkString,
           checkNumber, etc. to validate the proper input type first.*/

export function isVariableThere(variable, varName) {
    if (!variable) {
        throw `${varName} was not provided`;
    }
    return variable;
}

export function checkUserAge(_var, varName) {
    _var = checkNumber(_var, varName);
    //Yousaf - Not sure if the age should be more than 13 or 18 but imma do 18 for now
    //Chose 122 because the older person in the world reach 122 but we can change this later
    //if need be
    if (_var < 18 || _var > 122) {
        throw `${varName} must be a valid age`;
    }
}

export function checkPhoneNumber(_var, varName) {
    _var = checkString(_var, varName);
    if (_var.length() !== 10) {
        throw `${varName} must be a valid phone number with the proper length`;
    }
    if (_var.replace(/[^0-9.]/g, "").length() !== 10) {
        throw `${varName} must be a valid phone number`;
    }
    return _var.trim();
}

export function checkPetWeight(_var, varName) {
    _var = checkNumber(_var, varName);
    _var = parseFloat(parseFloat(_var).toFixed(1)); // Round to 1 decimal point and parse back to float
    if (_var < 1 || _var > 180) {
        throw new Error(`${varName} must be a valid weight`);
    }
    return _var;
}

export function checkAgePreferences(_var, varName) {
    checkNumber(_var, varName);
    if (_var <= 0 || _var > 20) {
        `${varName} must be a valid age preference between 0 exclusive and 20 inclusive`;
    }
}
