Adoption Centers
{
    ContactFirstName
    ContactLastName
    Phone Number
    Website
    workingHours
    UserName
    CompanyName
    Email
    Password
    Dogs [
        Dogs subdoc
        {
            Name
            Gender
            Breed
            Size
            Age
            //pull more from https://www.akc.org/breed-selector-tool/#/question/1
        }
    ]
    Address
}

Users
{
    firstName
    LastName 
    UserName
    Email
    Password
    Age
    Preferences
    likedDogs
}

Messages
{
    to: id
    from: id
    message: []
}

Animate css for animation