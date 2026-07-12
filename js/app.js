;"use strict";

/*
==========================================
Login Protection
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop();

    if (
        currentPage !== "login.html" &&
        localStorage.getItem("adminLoggedIn") !== "true"
    ) {

        window.location.href = "login.html";
        return;

    }

    console.log("Tesla Admin Panel Loaded");

    /*
    ==========================================
    Logout
    ==========================================
    */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (e) {

            e.preventDefault();

            if (confirm("Are you sure you want to logout?")) {

                localStorage.removeItem("adminLoggedIn");

                window.location.href = "login.html";

            }

        });

    }

});