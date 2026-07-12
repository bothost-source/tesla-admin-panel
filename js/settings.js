"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Settings page loaded.");

    const saveBtn = document.querySelector(".btn-danger");

    if(saveBtn){

        saveBtn.addEventListener("click", () => {

            alert("Settings saved successfully. (Demo)");

        });

    }

    const passwordBtn = document.querySelector(".btn-dark");

    if(passwordBtn){

        passwordBtn.addEventListener("click", () => {

            alert("Password updated successfully. (Demo)");

        });

    }

});