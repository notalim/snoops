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
        email = validation.isVariableThere(email, 'email');
        password = validation.isVariableThere(password, 'password');
        firstName = validation.isVariableThere(firstName, 'firstName');
        lastName = validation.isVariableThere(lastName, 'lastName');
        age = validation.isVariableThere(age, 'age');
        phone = validation.isVariableThere(phone, 'phone');
        address = validation.isVariableThere(address, 'address');

        //CHECK EMAIL
        email = validation.checkEmail(email, 'email');

        //CHECK PASSWORD
        password = validation.checkPassword(password, 'password');
        //WHAT CRITERIA FOR PASSWORD?

        //CHECK FIRSTNAME
        firstName = validation.checkString(firstName, 'firstName');
        //MAKE A CHECK FIRST NAME FUNCTION

        //CHECK LASTNAME
        lastName = validation.checkString(lastName, 'lastName');
        //MAKE A CHECK LAST NAME FUNCTION

        //CHECK AGE
        age = validation.checkUserAge(age, "age");

        //CHECK PHONE NUMBER
        phone = validation.checkPhoneNumber(phone, "phone");
        //Have to check to see if NPM works here
        

        //CHECK ADDRESS
        address = validation.checkString(address, 'address');
        //What criteria for this!!

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


        
    },
    async getUserById(id){
        id = validation.checkId(id, "User ID");
        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        if (!user){
            throw 'User not found'
        }
        return user;
    },
    async removeUser(id){
        id = validation.checkId(id, "User ID");
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
            _id: ObjectId(id)
        });
        if (deletionInfo.lastErrorObject.n === 0){
            throw [404, `Error: Could not delete user with id of ${id}`];
        }
        return {id, deleted: true};
    }
};

export default exportedMethods;

