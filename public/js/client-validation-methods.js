function checkString(str, strName) {
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

function checkNumber(num, numName) {
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

function checkStringArray(arr, arrName) {
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

function checkName(name, varName) {
    name = checkString(name, varName);
    if (name.length < 2) {
        throw `${varName} must be at least 2 characters`;
    }
    if (name.split(" ").length > 1) {
        throw `${varName} must be a single word`;
    }
    let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/g;
    if (name.replace(regex, "").length !== name.length) {
        throw `${varName} must not consist of special characters`;
    }
    return name.trim();
}

function checkLegalAge(age, elmName) {
    age = checkNumber(age, elmName);
    if (age < 18) {
        throw `${elmName} must be at least 18 years old`;
    }
    return age;
}

function checkPassword(password, elmName) {
    password = checkString(password, elmName);
    if (password.length != password.replace(" ", "").length) {
        throw `${elmName} can not contain spaces`;
    }

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
    return password;
}

function checkEmailRegex(email, elmName) {
    email = checkString(email, elmName);
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let emailCheck = regex.test(email);
    if (!emailCheck) throw `The ${elmName} is invalid`;
    return email.trim().toLowerCase();
}

function checkDate(date, elmName, minAge = 18, maxAge = 120) {
    date = checkString(date, elmName);
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        throw `${elmName} must be in the format YYYY-MM-DD`;
    }
    let dob = new Date(date);
    let age = calculateAge(dob);

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

function checkPhoneRegex(_var, varName) {
    let Number = checkString(_var, varName);

    let phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    let phoneCheck = phoneRegex.test(Number);
    if (!phoneCheck) throw `${varName} invalid`;

    return Number;
}

function checkPetWeight(_var, varName) {
    _var = checkNumber(_var, varName);
    _var = parseFloat(parseFloat(_var).toFixed(1)); // Round to 1 decimal point and parse back to float
    if (_var < 1 || _var > 180) {
        throw new Error(`${varName} must be a valid weight`);
    }
    return _var;
}

function checkBreed(_var, varName) {
    let breedWords = _var.split(" ");
    for (let word of breedWords) {
        if (word.length < 2) {
            throw `${varName} must be at least 2 characters`;
        }
        word = checkName(word, varName);
    }
    return _var;
}

function checkAgePreferences(_var, varName) {
    checkNumber(_var, varName);
    if (_var <= 0 || _var > 20) {
        `${varName} must be a valid age preference between 0 exclusive and 20 inclusive`;
    }
    return _var;
}

export function checkBoolean(bool, elmName) {
    if (typeof bool !== "boolean") {
        throw `${elmName} must be a boolean`;
    }
    return bool;
}

export function checkMaxPreference(max, elmName) {
    try{
    max = parseInt(max);
    max = checkNumber(max, elmName);
    if (max < 1) {
        throw `${elmName} must be a valid preference above 0`;
    }
    return max;
    }catch(e){
        throw `${elmName} must be a valid preference above 0`;
    }
}

export function checkGender(gender, elmName) {
    gender = checkString(gender, elmName);
    if (!(gender === "M" || gender === "F")) {
        throw `Invalid value for ${elmName}`;
    }
    return gender.trim();
}

function checkAdoptionStatus(status, elmName) {
    status = checkString(status, elmName);
    console.log(status);
    if (!(status === "Available" || status === "Adopted" || status === "Pending")) {
        throw `Invalid value for ${elmName}`;
    }

    return status.trim();
}

let exportedMethods = {
    checkString,
    checkNumber,
    checkStringArray,
    checkName,
    checkLegalAge,
    checkPassword,
    checkEmailRegex,
    checkDate,
    checkPhoneRegex,
    checkPetWeight,
    checkAgePreferences,
    checkBoolean,
    checkMaxPreference,
    checkGender,
    checkBreed,
    checkAdoptionStatus
};

export default exportedMethods;