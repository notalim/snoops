# Schema

---

### Adoption Centers

It has basic user features + business features (`"address"`, `"workingHours"`, `"website"`). It has a subdocument of dog objects to store dogs data.

```
{
    "id": ObjectId
    "email":
    "name":
    "password":
    "contactFirstName":
    "contactLastName":
    "phone":
    "address":
    "workingHours":
    "website":
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

> pull more from https://www.akc.org/breed-selector-tool/#/question/1

| Field Name                              | Field Type | Description                                                                           |
| --------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `_id`                                   | string     | A globally unique identifier to represent the adoption center.                        |
| `contactFirstName` / `contactFirstName` | string     | The name of the person user would speak to in case of contacting the adoption center. |
| `companyName`                           | string     | Company name of the adoption center.                                                  |
| `dogList`                               | array      | Listed dogs and their relevant information for the adoption center.                   |

#### Example of an adoption center document:

```
{
    "id": ObjectId,
    "email": "adoption@center.com",
    "name": "Adoption Center",
    "password": "password",
    "contactFirstName": "John",
    "contactLastName": "Doe",
    "phone": "0123456789",
    "address": "1 Castle Point, Hoboken",
    "workingHoursStart": "10AM",
    "workingHoursEnd": "06PM",
    "website": "adoptioncenter.com",
    "img": "img1.link",
    "dogList": [
        {
            "id": ObjectId,
            "name": "Louis",
            "breeds": ["Chocolate Labrador Retriever"],
            "age": 1,
            "gender": "M",
            "size": 30
        },...
    ]
}
```

---

### Dogs

Object subdocument that stores the dog data.

```
{
    "id": ObjectId
    "name":
    "breeds": [...]
    "img": [...]
    "age":
    "gender":
    "size":
}
```

| Field Name | Field Type | Description                                        |
| ---------- | ---------- | -------------------------------------------------- |
| `_id`      | string     | A globally unique identifier to represent the dog. |
| `breeds`   | array      | Breeds of the dog listed.                          |
| `gender`   | string     | Can be either `M` or `F`                           |
| `size`     | number     | Weight of the dog in pounds.                       |

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
        "agePreferences": [...]
        "genderPreferences": <M or F>
    }
    "likedDogs": [{"acenterId": ...
                        "dogsId": },
                    {"acenterId": ...
                        "dogsId": } ...]
    "seenDogs": [{"acenterId": ...
                        "dogsId": },
                    {"acenterId": ...
                        "dogsId": } ...]
}
```

| Field Name       | Field Type | Description                                                                                    |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `_id`            | string     | A globally unique identifier to represent the user.                                            |
| `address`        | string     | The address of the user.                                                                       |
| `companyName`    | string     | Company name of the adoption center.                                                           |
| `dogPreferences` | Object     | It stores dog preferences of the users. Every preference can have "no preference" as a choice. |

#### Example of a user document:

```
{
    "id": ObjectId,
    "email": "user@email.com",
    "password": "password",
    "firstName": "Patrick",
    "lastName": "Hill",
    "age": 22,
    "phone": "9876543210",
    "address": "1 Edwin A. Stevens, Hoboken",
    "img": "img2.link"
    "dogPreferences": {
        "sizePreferences": 30
        "breedsPreferences": ["Husky", "Pomeranian"]
        "agePreferencesLowerBound": 0.2
        "agePreferencesUpperBound": 0.4
        "genderPreferences": "F"
    }
    "likedDogs": [ObjectId, ObjectId],
    "seenDogs": [ObjectId, ObjectId]
}
```

---

### Users Dogs Preferences

Object that stores the dog preference data for users.

```
{
    "sizePreferences": <weight>
    "breedsPreferences": [...]
    "agePreferences": [...]
    "genderPreferences": <M or F>
}
```

| Field Name                                              | Field Type | Description                                              |
| ------------------------------------------------------- | ---------- | -------------------------------------------------------- |
| `sizePreferences`                                       | number     | User preferred size of the dog (weight in lbs).          |
| `agePreferences`| array | User preferred ages of dogs |

---

### Chat

A collection that stores the existing coversations between users and adoption centers.

```
{
    "userId": ObjectId,
    "centerId": ObjectId,
    "messages": [{
    "senderId": ObjectId
    "messageContent": <contents>
     "messageTime": <timestamp>
    },
    ...
]}
```

| Field Name | Field Type | Description                                           |
| ---------- | ---------- | ----------------------------------------------------- |
| `userId`   | ObjectId   | A globally unique identifier to represent the user.   |
| `centerId` | ObjectId   | A globally unique identifier to represent the center. |
| `message`  | array      | An array of message subdocuments in the chat.         |

---

#### Example of a chat document:

```
{
    "userId": ObjectId1,
    "centerId": ObjectId2,
    "messages":
        [{
            "senderId": ObjectId1,
            "messageContent": "Hey, I'm interested in Louis! Is there any time we could arrange a meeting?",
            "messageTime": Date()
        }, {
            "senderId": ObjectId2,
            "messageContent": "Sure, how about Monday at 3PM?",
            "messageTime": Date()
        }, {
            "senderId": ObjectId1,
            "messageContent": "Alright, see you then!",
            "messageTime": Date()
        }]
}
```

### Message

A message is a subdocument in an array of messages that shows who sent what and when.

```
{
    "senderId": ObjectId
    "messageContent": <contents>
    "messageTime": <timestamp>
}
```

| Field Name       | Field Type | Description                                   |
| ---------------- | ---------- | --------------------------------------------- |
| `senderId`       | ObjectId   | Identifier to represent who sent the message. |
| `messageContent` | string     | Contents of the message.                      |
| `messageTime`    | Date       | The time the message was sent.                |
