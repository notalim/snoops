import {users} from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';
import {phone} from 'phone';

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },
    async addUser(email, password, firstName, lastName, age, phone, address, img) {
        //CHECKING IF VARS PRESENT
        validation.isVariableThere(email, 'email');
        validation.isVariableThere(password, 'password');
        validation.isVariableThere(firstName, 'firstName');
        validation.isVariableThere(lastName, 'lastName');
        validation.isVariableThere(age, 'age');
        validation.isVariableThere(phone, 'phone');
        validation.isVariableThere(address, 'address');

        //CHECK EMAIL
        validation.checkString(email, 'email');
        validation.checkEmail(email, 'email');

        //CHECK PASSWORD
        validation.checkString(password, 'password');
        //WHAT CRITERIA FOR PASSWORD?

        //CHECK FIRSTNAME
        validation.checkString(firstName, 'firstName');
        //ANY OTHER CHECKS HERE?

        //CHECK LASTNAME
        validation.checkString(lastName, 'lastName');
        //SAME HERE

        //CHECK AGE
        validation.checkNumber(age, 'age');
        if (age < 18){
            throw `User must be at least 18 years old`
        }

        //CHECK PHONE NUMBER
        //Have to check to see if NPM works here
        validation.checkString(phone, "phone number")
        let phoneCheck = phone(phone);
        if (phoneCheck.isValid === false){
            throw `Invalid phone number`
        }

        //CHECK ADDRESS
        validation.checkString(address, 'address');
        //What criteria for this

        //SHOULD WE CHECK IMG OR INITIALIZE TO NULL

        let newUser = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            age: age,
            phone: phone,
            address: address,
            img: null,
            dogPreferences: {},
            likedDogsIds: []
        }
        //SHOULD WE CHECK IF THERE ARE DUP USERS, EX: SAME FIRST AND LAST
        const userCollection = await users();
        const newInsertInformation = await userCollection.insertOne(newUser);
        if (!newInsertInformation.insertedId){
            throw `Insert failed!`
        }

        //Want to return the get method just to check if its there so have to implement


        
    }
};

export default exportedMethods;

