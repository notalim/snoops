# Schema
---
### Adoption Centers

It has basic user features + business features (`"address"`, `"workingHours"`, `"website"`). It has a subdocument of dog objects to store dogs data.

```
{
    "id": ObjectId
    "email":
    "password":
    "contactFirstName":
    "contactLastName":
    "phone":
    "address":
    "workingHours":
    "website":
    "userName":
    "companyName":
    "img":
    "dogList": [ 
        {
            "id": ObjectId
            "name"
            "breeds"
            "age"
            "gender"
            "size"
        },...
    ]
}

```
> //pull more from https://www.akc.org/breed-selector-tool/#/question/1

| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `_id`       | string      | A globally unique identifier to represent the adoption center. |
| `contactFirstName` / `contactFirstName` | string | The name of the person user would speak to in case of contacting the adoption center.
|`companyName`| string      | Company name of the adoption center.
|`dogList`    | array       | Listed dogs and their relevant information for the adoption center.
---
### Dogs

Object that stores the dog data.

```
{
    "id": ObjectId
    "name"
    "breeds": [...]
    "age"
    "gender"
    "size"
}
```

| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `_id`       | string      | A globally unique identifier to represent the dog. |
| `breeds`    | array       | Breeds of the dog listed.|
| `gender`    | string      | Can be either `M` or `F`|
| `size`      | number      | Weight of the dog in pounds.|

---
### Users

A collection of users. It has basic user features and it stores relevant information about their dog preferences in the `dogPreferences` subdocument. Note: `likedDogsIds` is an array of ObjectIds, not a subdocument.

```
{
    "id": ObjectId
    "email"
    "password"
    "firstName"
    "lastName"
    "age"
    "phone"
    "address"
    "img"
    "dogPreferences": { 
        "sizePreferences": <weight>
        "breedsPreferences": [...]
        "agePreferencesLowerBound":
        "agePreferencesUpperBound": 
        "genderPreferences": <M or F>
    }
    "likedDogsIds": [...]
}
```
| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `_id`       | string      | A globally unique identifier to represent the user. 
| `address`   | string      | The address of the user.
|`companyName`| string      | Company name of the adoption center.
|`dogPreferences`    | array       | It stores dog preferences of the users. Every preference can have "no preference" as a choice.

---
### Users Dogs Preferences

Object that stores the preference data for users.

```
{
    "sizePreferences": <weight>
    "breedsPreferences": [...]
    "agePreferencesLowerBound":
    "agePreferencesUpperBound": 
    "genderPreferences": <M or F>
}
```
| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `sizePreferences`       | number     | User preferred size of the dog (weight in lbs). 
| `agePreferencesLowerBound` , `agePreferencesUpperBound` | number    | Lower and Upper bound for user preferred age of the dog.
---
### Chat

A collection that stores the existing coversations between users and adoption centers.
```
{ 
    "userId": ObjectId
    "centerId": ObjectId
"messages": [{
    "senderId": ObjectId
    "messageContent": <contents>
     "messageTime": <timestamp>
    },
    ...
]}
```
| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `userId`    |  ObjectId   | A globally unique identifier to represent the user. 
| `centerId`  |  ObjectId   | A globally unique identifier to represent the center.
---
### Message

A message is a subdocument in an array of messages that shows who sent what and when.
```
{ 
    "senderId": ObjectId
    "messageContent": <contents>
    "messageTime": <timestamp>
}
```
| Field Name  | Field Type  | Description |
| ----------- | ----------- |-------------|
| `senderId`  |  ObjectId   | Identifier to represent who sent the message.
| `messageContent`  |  string   | Contents of the message.
| `messageTime` | Date | The time the message was sent.;