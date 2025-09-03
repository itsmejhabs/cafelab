// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'cafelab_theme';
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
    }
}
// Initialize theme from storage or prefers-color-scheme
const storedTheme = localStorage.getItem(THEME_KEY);
if (storedTheme) {
    applyTheme(storedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
}
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    });
}

// EmailJS initialization
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
})();

// Contact form handling
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userMessage = document.getElementById('userMessage').value;
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: userName,
        from_email: userEmail,
        message: userMessage,
        to_email: 'info@cafelab.com' // Your email address
    })
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        successMessage.style.display = 'block';
        contactForm.reset();
    })
    .catch(function(error) {
        console.log('FAILED...', error);
        errorMessage.style.display = 'block';
    })
    .finally(function() {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});

// Simple gallery lightbox
const galleryImages = document.querySelectorAll('.gallery-img');
galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 2000;
        const imgClone = document.createElement('img');
        imgClone.src = img.src;
        imgClone.style.maxWidth = '90vw';
        imgClone.style.maxHeight = '80vh';
        imgClone.style.borderRadius = '10px';
        overlay.appendChild(imgClone);
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        document.body.appendChild(overlay);
    });
}); 

// Rating widget
const ratingWidget = document.getElementById('ratingWidget');
const ratingMessage = document.getElementById('ratingMessage');
if (ratingWidget) {
    const stars = Array.from(ratingWidget.querySelectorAll('.star'));
    const STORAGE_KEY = 'cafelab_user_rating';

    function setSelected(rating) {
        stars.forEach((star, idx) => {
            const isActive = idx < rating;
            star.classList.toggle('selected', isActive);
            star.setAttribute('aria-checked', isActive && idx === rating - 1 ? 'true' : 'false');
        });
        if (ratingMessage) {
            ratingMessage.textContent = rating ? `Thanks! You rated us ${rating}/5.` : 'Tap a star to rate your experience.';
        }
    }

    // Load saved rating
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (!Number.isNaN(saved) && saved > 0) {
        setSelected(saved);
    }

    // Hover preview
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => s.classList.toggle('hovered', i <= index));
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });
        star.addEventListener('click', () => {
            const value = index + 1;
            localStorage.setItem(STORAGE_KEY, String(value));
            setSelected(value);
        });
        // Keyboard support
        star.addEventListener('keydown', (e) => {
            const key = e.key;
            const current = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
            if (key === 'ArrowRight' || key === 'ArrowUp') {
                e.preventDefault();
                const next = Math.min(5, current + 1 || index + 1);
                localStorage.setItem(STORAGE_KEY, String(next));
                setSelected(next);
                stars[Math.max(0, next - 1)].focus();
            } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
                e.preventDefault();
                const prev = Math.max(1, current - 1 || index + 1);
                localStorage.setItem(STORAGE_KEY, String(prev));
                setSelected(prev);
                stars[Math.max(0, prev - 1)].focus();
            } else if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                const value = index + 1;
                localStorage.setItem(STORAGE_KEY, String(value));
                setSelected(value);
            }
        });
        // Make buttons focusable in all browsers
        star.setAttribute('tabindex', '0');
    });
}