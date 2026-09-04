document.addEventListener('DOMContentLoaded', function() {
    // Safely set current year if element exists
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle - only if elements exist
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    
    if (mobileMenuToggle && primaryNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const visibility = primaryNav.getAttribute('data-visible');
            primaryNav.setAttribute('data-visible', visibility === "false" ? "true" : "false");
            mobileMenuToggle.setAttribute('aria-expanded', visibility === "false" ? "true" : "false");
        });
    }
});

