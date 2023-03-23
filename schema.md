# Schema
---
### Adoption Centers
```
{
    id
    email
    password
    contactFirstName
    contactLastName
    phone
    address
    workingHours
    website
    userName
    companyName
    dogList [ 
        {
            name
            breeds
            age
            gender
            size
            image
        },...
    ]
}

```
> //pull more from https://www.akc.org/breed-selector-tool/#/question/1

---
### Users
```
{
    id
    email
    password
    contactFirstName
    contactLastName
    image
    age
    phone
    address
    dogPreferences = {
        /* we can fix it later */
        /* every preference ca have no preference as a choice */
        sizePreferences: <weight>
        breedsPreferences = [...],
        agePreferencesLowerBound,
        agePreferencesUpperBound, 
        genderPreferences: <M or F>
    }
    likedDogs = [{..},{..}...]
}
```
---
### Messages
```
[
{
    toId: id
    fromId: id
    messageContent: <contents>
},...
]
```

> Animate css for animation