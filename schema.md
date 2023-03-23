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

---
### Users

A collection of users. It has basic user features and it stores relevant information about their dog preferences in the `dogPreferences` subdocument. Note: `likedDogsIds` is an array of ObjectIds, not a subdocument.

```
{
    "id": ObjectId
    "email"
    "password"
    "contactFirstName"
    "contactLastName"
    "age"
    "phone"
    "address"
    "img"
    "dogPreferences": {
        /* we can fix it later */
        /* every preference can have no preference as a choice */
        "sizePreferences": <weight>
        "breedsPreferences": [...]
        "agePreferencesLowerBound":
        "agePreferencesUpperBound": 
        "genderPreferences": <M or F>
    }
    "likedDogsIds": [...]
}
```

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