"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Cars page loaded.");

    const addCarBtn = document.querySelector(".btn-danger");

    if (addCarBtn) {

        addCarBtn.addEventListener("click", () => {

            alert("Add Car feature will be connected to the backend.");

        });

    }

    document.querySelectorAll(".btn-primary").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("View Car Details");

        });

    });

    document.querySelectorAll(".btn-warning").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("Edit Car");

        });

    });

    document.querySelectorAll(".btn-danger.btn-sm").forEach(btn => {

        btn.addEventListener("click", () => {

            if (confirm("Delete this car?")) {

                alert("Car deleted (Demo)");

            }

        });

    });

});