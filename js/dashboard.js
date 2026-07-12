"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard loaded.");

    // Animate statistic numbers

    const numbers = document.querySelectorAll(".stat-card h2");

    numbers.forEach(number => {

        const target = parseInt(number.textContent.replace(/[^0-9]/g, "")) || 0;

        let count = 0;

        const speed = Math.max(1, Math.floor(target / 50));

        const timer = setInterval(() => {

            count += speed;

            if (count >= target) {

                count = target;

                clearInterval(timer);

            }

            number.textContent = target > 999 ? count.toLocaleString() : count;

        }, 20);

    });

    // Dashboard buttons

    document.querySelectorAll(".btn").forEach(btn => {

        btn.addEventListener("click", () => {

            console.log("Button:", btn.innerText);

        });

    });

});