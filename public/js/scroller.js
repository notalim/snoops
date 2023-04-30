let dogsData = JSON.parse('{{{dogs}}}');
    
        function breedName(breeds) {
            if (breeds.length > 1) {
                return breeds[0] + " Mix";
            } else {
                return breeds[0];
            }
        }

        let dogName = document.getElementById("dog-name");
        let dogBreeds = document.getElementById("dog-breeds");
        let dogAge = document.getElementById("dog-age");
        let dogImage = document.getElementById("dog-image");
        let dogDescription = document.getElementById("dog-description");

        dogName.textContent = dogsData[0].name;
        dogBreeds.textContent = breedName(dogsData[0].breeds);
        dogAge.textContent = dogsData[0].age;
        dogImage.src = dogsData[0].img;
        dogDescription.textContent = dogsData[0].description;

        let dogId = dogsData[0]._id.toString();
        let dogAcenterId = dogsData[0].acenterId.toString();

        let i = 0;

        let leftButton = document.getElementsByClassName("scroller-button")[0];
        let rightButton = document.getElementsByClassName("scroller-button")[1];

        function goBack() {
            if (i === 0) {
                i = dogsData.length - 1;
            } else {
                i--;
            }

            dogName.textContent = dogsData[i].name;
            dogBreeds.textContent = breedName(dogsData[i].breeds);
            dogAge.textContent = dogsData[i].age;
            dogImage.src = dogsData[i].img;
            dogDescription.textContent = dogsData[i].description;
        };

        function goForward(){
            if (i === dogsData.length) {
                i = 0;
            } else {
                i++;
            }

            dogName.textContent = dogsData[i].name;
            dogBreeds.textContent = breedName(dogsData[i].breeds);
            dogAge.textContent = dogsData[i].age;
            dogImage.src = dogsData[i].img;
            dogDescription.textContent = dogsData[i].description;
            dogId = dogsData[i]._id.toString();
            dogAcenterId = dogsData[i].acenterId.toString();
        };

        //like button post request
         $("#likeButton").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: `/users/{{user._id}}/like/${dogAcenterId}/${dogId}`,
                type: "POST",
                data: {dogId: dogsData[i]._id},
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    console.log(err);
                },
            });
            goForward();
        }); 