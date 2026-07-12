"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Sidebar loaded.");

    // Highlight current page

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar-menu a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.parentElement.classList.add("active");

        }

    });

    // Future sidebar toggle support

    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebarToggle) {

        sidebarToggle.addEventListener("click", () => {

            document.querySelector(".sidebar").classList.toggle("show");

        });

    }

});