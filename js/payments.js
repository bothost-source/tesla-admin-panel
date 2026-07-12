"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Payments page loaded.");

    const exportBtn = document.querySelector(".btn-danger");

    if(exportBtn){

        exportBtn.addEventListener("click", () => {

            alert("Export feature will be connected to the backend.");

        });

    }

    const filterBtn = document.querySelector(".btn-dark");

    if(filterBtn){

        filterBtn.addEventListener("click", () => {

            alert("Filter feature will be connected to the backend.");

        });

    }

    document.querySelectorAll(".btn-primary").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("View Payment Details");

        });

    });

});