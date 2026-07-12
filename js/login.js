const ACCESS_CODE = "YAHOO_BOI123";

document
    .getElementById("loginForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const code = document
            .getElementById("accessCode")
            .value
            .trim();

        if (code === ACCESS_CODE) {

            localStorage.setItem("adminLoggedIn", "true");

            window.location.href = "index.html";

        } else {

            alert("Invalid Access Code!");

        }

    });