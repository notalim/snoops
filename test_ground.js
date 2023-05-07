import * as validation from './validation.js';

function checkName(name, varName) {
    name = validation.checkString(name, varName);
    if (name.length < 2) {
        throw `${varName} must be at least 2 characters`;
    }
    if (name.split(" ").length > 1) {
        throw `${varName} must be a single word`;
    }
    let regex_num = /\d/;
    if (regex_num.test(name)){
        throw `${varName} cannot contain numbers`;
    }
    let regex_special = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (!regex_special.test(name)) {
        throw `${varName} must not consist of special characters`;
    }
    return name.trim();
}

try{
    let name = "Ky,.''---4le"
    let result = checkName(name, "name");
} catch (e){
    console.log(e);
}