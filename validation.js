import {ObjectId} from 'mongodb';
export function checkString(str, strName){
    if(!str){
      throw `You must provide a ${strName}`;
    }
    if(typeof str !== 'string'){
      throw `${strName} must be a string`;
    }
    if(str.trim().length === 0){
      throw `${strName} can not be an empty string or a string with just spaces`
    }
    str = str.trim();
    return str;
  }
export function checkNumber(num, numName){
    if(!num){
      throw `You must provide a ${numName}`;
    }
    if(typeof num !== 'number'){
      throw `${numName} must be a number`;
    }
    if (isNaN(num)){
      throw `${numName} cannot be NaN`
    }
    return num;
  }
export function checkStringArray(arr, arrName){
    if(!arr){
      throw `You must provide a ${arrName}`;
    }
    if(!Array.isArray(arr) || arr.length === 0){
      throw `${arrName} must be a non-empty array`;
    }
    for(let elm of arr){
      checkString(elm, arrName + " element");
    }
    return arr;
  }

export function checkId(id, varName) {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') {
    throw `Error:${varName} must be a string`;
  }
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

export function checkWebsite(website, elmName){
  //Check NPM packages for this (imma take a look too) - Kyle

}

export function checkEmail(email, elmName){
  //Check NPM packages for this (imma take a look too) - Kyle

}

export function checkGender(gender, elmName){
  checkString(gender, elmName);
  if (!(gender === "M" || gender === "F")){
    throw `Invalid value for ${elmName}`
  }
  return gender;

}

export function checkWorkingHours(workingHours, elmName){

}

export function isVariableThere(variable, varName){
  if (!variable){
    throw `${varName} was not provided`
  }
  return variable;
}

