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
    var regex = [/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g];
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
    let regex = /[a-z|A-Z|0-9|_|.|-]+@[a-z|A-Z|0-9|-]+.[a-z]{2,}/;
    let emailCheck = regex.test(email);
    if (!emailCheck) throw `${elmName} invalid`;
    return email.trim().toLowerCase();
}

function checkDate(date, elmName) {
    date = checkString(date, elmName);
    let dob = new Date(date);
    let mon_diff = Date.now() - dob.getTime();
    let age_diff = new Date(mon_diff);
    let year = age_diff.getUTCFullYear();
    let age = Math.abs(year - 1970);
    if (elmName === "User Date of Birth") {
        if (age < 18 || age > 122) {
            throw `${elmName} must be a valid age (18-122)`;
        }
    }
    return date.trim();
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

function checkAgePreferences(_var, varName) {
    checkNumber(_var, varName);
    if (_var <= 0 || _var > 20) {
        `${varName} must be a valid age preference between 0 exclusive and 20 inclusive`;
    }
    return _var;
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
};

export default exportedMethods;