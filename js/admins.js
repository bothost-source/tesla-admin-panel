"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Admins page loaded.");

    const addAdminBtn = document.querySelector(".btn-danger");

    if(addAdminBtn){

        addAdminBtn.addEventListener("click", () => {

            alert("Add Admin feature will be connected to the backend.");

        });

    }

    document.querySelectorAll(".btn-primary").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("View Admin");

        });

    });

    document.querySelectorAll(".btn-warning").forEach(btn => {

        btn.addEventListener("click", () => {

            alert("Edit Admin");

        });

    });

    document.querySelectorAll(".btn-danger.btn-sm").forEach(btn => {

        btn.addEventListener("click", () => {

            if(confirm("Delete this administrator?")){

                alert("Administrator deleted (Demo)");

            }

        });

    });

});
