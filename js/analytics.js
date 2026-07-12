"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Analytics page loaded.");

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        row.addEventListener("click", () => {

            console.log("Selected:", row.cells[0].textContent);

        });

    });

});