    // Update acenter with AJAX
    $("#update-acenter").submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: `/acenters/{{acenter._id}}`,
            type: "PUT",
            data: $("#update-acenter").serialize(),
            success: function (data) {
                console.log(data);

                let successMessage = document.getElementById("success");
                if (successMessage) {
                    successMessage.remove();
                }

                let errorMessage = document.getElementById("error");
                if (errorMessage) {
                    errorMessage.remove();
                }

                let success = document.createElement("p");
                let container = document.querySelector(".acenter-info-form");

                success.innerText = "Adoption Center updated successfully";
                success.style.color = "green";
                success.style.marginTop = "10px";
                success.style.textAlign = "center";
                success.id = "success";
                container.appendChild(success);
            },
            error: function (err) {
                let data = $("#update-acenter").serialize();
                console.log(err);
                console.log(data);

                let errorMessage = document.getElementById("error");
                if (errorMessage) {
                    errorMessage.remove();
                }

                let successMessage = document.getElementById("success");
                if (successMessage) {
                    successMessage.remove();
                }

                let error = document.createElement("p");
                let container = document.querySelector(".acenter-info-form");
                let errorText = err.responseJSON.error;
                error.innerText = errorText;
                error.style.color = "red";
                error.style.marginTop = "10px";
                error.style.textAlign = "center";
                error.id = "error";
                container.appendChild(error);
            },
        });
    });