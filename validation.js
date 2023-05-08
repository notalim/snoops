import { ObjectId } from "mongodb";
import * as Validator from "email-validator"; //Yousaf - Url: https://www.npmjs.com/package/email-validator
import { phone } from "phone";
import validator from "validator"; //Yousaf - Url: https://www.npmjs.com/package/validator
//Yousaf - We can prolly just use validator to handle both email and website
import passwordHash from "password-hash";
import Filter from "bad-words"; // Url: https://www.npmjs.com/package/bad-words

import NodeGeocoder from "node-geocoder";
import dotenv from "dotenv";
dotenv.config();

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

export function checkId(id, type = "Object", funcName = "Unknown function") {
    if (!id || typeof id !== "string") {
        throw `Error in ${funcName}: ${type} ID is required and must be a string`;
    }
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) {
        throw `Error in ${funcName}: ${type} ID invalid object ID`;
    }
    return id.trim();
}

export function checkName(name, varName) {
    name = checkString(name, varName);
    if (name.length < 2) {
        throw `${varName} must be at least 2 characters`;
    }
    if (name.split(" ").length > 1) {
        throw `${varName} must be a single word`;
    }
    // no numbers and symbols are allowed in the regex
    let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/g;
    if (name.replace(regex, "").length !== name.length) {
        throw `${varName} must not consist of special characters`;
    }
    return name.trim();
}

export function checkCompany(comp, varName) {
    comp = checkString();
    return comp.trim();
}

export function checkLegalAge(age, elmName) {
    age = checkNumber(age, elmName);
    if (age < 18) {
        throw `${elmName} must be at least 18 years old`;
    }
    return age;
}

export function hashPassword(password) {
    return passwordHash.generate(password);
}

export function checkPassword(password, elmName) {
    password = checkString(password, elmName);
    if (password.length != password.replace(" ", "").length) {
        throw `${elmName} can not contain spaces`;
    }
    if (!validator.isStrongPassword(password)) {
        if (password.length < 8) {
            throw `${elmName} has to be at least 8 characters`;
        }
        if (password.length === password.replace(/[^a-zA-Z0-9 ]/g, "").length) {
            throw `${elmName} must have at least one symbol (special character)`;
        }
        if (password.length === password.replace(/[a-z]/g, "").length) {
            throw `${elmName} must have at least one lower case character`;
        }
        if (password.length === password.replace(/[A-Z]/g, "").length) {
            throw `${elmName} must have at least one upper case character`;
        }
        if (password.length === password.replace(/[0-9]/g, "").length) {
            throw `${elmName} must have at least number`;
        }
    }
    return hashPassword(password);
}

export function checkWebsite(website, elmName) {
    //Yousaf - Found validator on NPM
    website = checkString(website, elmName);
    if (!validator.isURL(website)) {
        throw `${elmName} must be a valid URL`;
    }
    return website.trim();
}

export function checkBoolean(bool, elmName) {
    if (typeof bool !== "boolean") {
        throw `${elmName} must be a boolean`;
    }
    return bool;
}

export function checkOptionalMaxPrefrence(max, elmName) {
    if(max === null){
        return max;
    }
    max = parseInt(max);
    max = checkNumber(max, elmName);
    if (max < 1) {
        throw `${elmName} must be a valid preference above 0`;
    }
    return max;
}

export function checkEmail(email, elmName) {
    //Yousaf - Found package email-validator on npm, has like 600k downloads a week.
    //         I can do some testing with it later tho to check if it actually works
    //         If yall find anything else cool lmk
    email = checkString(email, elmName);
    if (!Validator.validate(email)) {
        throw `You must provide a valid email`;
    }
    return email.trim().toLowerCase();
}

export function checkDate(date, elmName, minAge = 18, maxAge = 120) {
    date = checkString(date, elmName);
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        throw `${elmName} must be in the format YYYY-MM-DD`;
    }
    let dob = new Date(date);
    // console.log(dob);
    let age = calculateAge(dob);
    // console.log(age);

    if (age < minAge || age > maxAge) {
        throw `${elmName} must be a valid age (${minAge}-${maxAge})`;
    }

    return date.trim();
}

function calculateAge(dateOfBirth) {
    const now = new Date();
    const age = now.getFullYear() - dateOfBirth.getFullYear();
    const m = now.getMonth() - dateOfBirth.getMonth();

    if (m < 0 || (m === 0 && now.getDate() < dateOfBirth.getDate())) {
        return age - 1;
    }
    return age;
}

export function checkGender(gender, elmName) {
    gender = checkString(gender, elmName);
    if (!(gender === "M" || gender === "F")) {
        throw `Invalid value for ${elmName}`;
    }
    return gender.trim();
}

export function checkWorkingHours(workingHours, elmName) {
    workingHours = checkString();
    if (workingHours.length !== 4) {
        throw `${elmName} must be in valid workingHour format HH(AM/PM)`;
    }
    if (isNan(Number(workingHours.substring(0, 2)))) {
        throw `${elmName} invalid time`;
    }
    if (
        Number(workingHours.substring(0, 2)) < 1 ||
        Number(workingHours.substring(0, 2)) > 12
    ) {
        throw `${elmName} has an invalid time`;
    }
    if (
        workingHours.substring(2) !== "AM" &&
        workingHours.substring(2) !== "PM"
    ) {
        throw `${elmName} must contain only AM or PM`;
    }
    return workingHours.trim();
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

export function checkPhone(_var, varName) {
    let Number = checkString(_var, varName);
    if (phone(Number).isValid === false) {
        throw `Invalid phone number`;
    }

    return Number;
}

export function checkPetWeight(_var, varName) {
    _var = checkNumber(_var, varName);
    _var = parseFloat(parseFloat(_var).toFixed(1)); // Round to 1 decimal point and parse back to float
    if (_var < 1 || _var > 180) {
        throw `${varName} must be a valid weight`;
    }
    return _var;
}

export function checkAgePreferences(_var, varName) {
    checkNumber(_var, varName);
    if (_var <= 0 || _var > 20) {
        `${varName} must be a valid age preference between 0 exclusive and 20 inclusive`;
    }
    return _var;
}

export function checkAddress(adr, varName) {
    // Yousaf - Change address to a subdocument potentially for map API
    return adr;
}

//Used to compare password to hash value, and will return a boolean
export function verifyPassword(password, hash) {
    return passwordHash.verify(password, hash);
}

export function checkMessage(message, varName) {
    message = checkString(message, "message");
    let filter = new Filter();
    try{
        message = filter.clean(message).trim();
    }catch(e){
        //console.log(e);
    }
    return message;
}

export async function getLatLong(address, elmName) {
    address = checkString(address, elmName);
    let apiKey = process.env.GOOGLE_MAP_API_KEY;
    let options = { provider: "google", apiKey: apiKey };

    let geocoder = NodeGeocoder(options);
    let res = await geocoder.geocode(address);
    let returnObj;
    if (!res || !res[0] || !res[0].latitude || !res[0].longitude) {
        throw `Your ${elmName} could not be found. Maybe try it in a different format?
        \n Example: 1234 Main St, City`;
    } else {
        returnObj = { lat: res[0].latitude, long: res[0].longitude };
    }

    return returnObj;
}

/*
[
  {
    formattedAddress: '538 Washington St, Hoboken, NJ 07030, USA',
    latitude: 40.7434407,
    longitude: -74.0294385,
    extra: {
      googlePlaceId: 'ChIJTcfNjd9ZwokRtavHyy8DRX8',
      confidence: 1,
      premise: null,
      subpremise: null,
      neighborhood: 'Hoboken',
      establishment: null
    },
    administrativeLevels: {
      level2long: 'Hudson County',
      level2short: 'Hudson County',
      level1long: 'New Jersey',
      level1short: 'NJ'
    },
    streetNumber: '538',
    streetName: 'Washington Street',
    city: 'Hoboken',
    country: 'United States',
    countryCode: 'US',
    zipcode: '07030',
    provider: 'google'
  }
]





*/
