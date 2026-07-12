"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Customers page loaded.");

    const addCustomerBtn = document.querySelector(".btn-danger");

    if (addCustomerBtn) {

        addCustomerBtn.addEventListener("click", () => {

            alert("Add Customer feature will be connected to the backend.");

        });

    }

    document.querySelectorAll(".btn-primary").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("View Customer");

        });

    });

    document.querySelectorAll(".btn-warning").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("Edit Customer");

        });

    });

    document.querySelectorAll(".btn-danger.btn-sm").forEach(btn => {

        btn.addEventListener("click", () => {

            if (confirm("Delete this customer?")) {

                alert("Customer deleted (Demo)");

            }

        });

    });

});