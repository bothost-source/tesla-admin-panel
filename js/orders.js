"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Orders page loaded.");

    const newOrderBtn = document.querySelector(".btn-danger");

    if (newOrderBtn) {

        newOrderBtn.addEventListener("click", () => {

            alert("New Order feature will be connected to the backend.");

        });

    }

    document.querySelectorAll(".btn-primary").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("View Order Details");

        });

    });

    document.querySelectorAll(".btn-warning").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("Edit Order");

        });

    });

    document.querySelectorAll(".btn-danger.btn-sm").forEach(btn => {

        btn.addEventListener("click", () => {

            if (confirm("Delete this order?")) {

                alert("Order deleted (Demo)");

            }

        });

    });

});