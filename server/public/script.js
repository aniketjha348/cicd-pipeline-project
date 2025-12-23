// public/js/script.js
// This file uses ES6 module syntax because of type="module" in index.html

document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animation ---
    // This uses the Intersection Observer API to add a class
    // when an element enters the viewport, triggering CSS transitions.

    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // Callback function for the Intersection Observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the element is visible, add the 'is-visible' class
                entry.target.classList.add('is-visible');
                // Stop observing this element once it's visible
                observer.unobserve(entry.target);
            }
        });
    };

    // Create a new Intersection Observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Select all sections that should have the scroll reveal effect
    // Add 'hidden-section' class initially in HTML or CSS for these sections
    const sectionsToObserve = document.querySelectorAll('.features-section, .benefits-section, .cta-section');

    // Observe each selected section
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle the 'active' class on the navigation links
            // This class will be used by CSS to show/hide the menu
            navLinks.classList.toggle('active');
        });

        // Close the mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }
});

