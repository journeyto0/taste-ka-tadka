// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navbarMenu = document.getElementById('navbarMenu');
const backToTopBtn = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const loader = document.getElementById('loader');
const menuItems = document.querySelectorAll('.menu-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toastContainer');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const cartCount = document.getElementById('cartCount');
const videoModal = document.getElementById('videoModal');
const watchVideoBtn = document.getElementById('watchVideoBtn');
const closeVideoModal = document.getElementById('closeVideoModal');
const videoFrame = document.getElementById('videoFrame');

// ===== Cart State =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ===== Performance Tracking =====
const performanceMetrics = {
    loadTime: performance.now(),
    interactiveTime: 0,
    firstPaint: 0
};

// ===== Initialize on Page Load =====
window.addEventListener('load', () => {
    performanceMetrics.interactiveTime = performance.now();
    
    // Animate loader progress bar
    const loaderProgress = document.querySelector('.loader-progress-bar');
    if (loaderProgress) {
        loaderProgress.style.width = '100%';
    }
    
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Initialize all animations after load
            initAnimations();
            
            // Log performance metrics
            logPerformanceMetrics();
        }
    }, 2000);

    // Update cart count on load
    updateCartCount();
    restoreFavorites();
});

// ===== Performance Logging =====
function logPerformanceMetrics() {
    const totalLoadTime = performance.now() - performanceMetrics.loadTime;
    console.log(`⚡ Page loaded in ${(totalLoadTime / 1000).toFixed(2)}s`);
}

// ===== Initialize Animations =====
function initAnimations() {
    // Animate hero stats
    animateHeroStats();
    
    // Start typing effect
    startTypingEffect();
    
    // Animate elements on scroll
    initScrollAnimations();

    // Initialize special timer
    initSpecialTimer();

    // Initialize testimonials slider
    initTestimonialsSlider();

    // Add flame particles animation
    createFlameParticles();
    
    // Initialize form interactions
    initFormInteractions();
}

// ===== Scroll Progress Bar =====
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// ===== Navbar Scroll Effect =====
let lastScrollY = 0;
let navbarHidden = false;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (navbar) {
        // Add scrolled class
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 500 && !navbarHidden) {
            navbar.style.transform = 'translateY(-100%)';
            navbarHidden = true;
        } else if (currentScrollY < lastScrollY && navbarHidden) {
            navbar.style.transform = 'translateY(0)';
            navbarHidden = false;
        }
    }
    
    lastScrollY = currentScrollY;
});

// ===== Mobile Menu Toggle =====
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isActive = menuToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== Close mobile menu on outside click =====
document.addEventListener('click', (e) => {
    if (navbarMenu && navbarMenu.classList.contains('active')) {
        if (!navbarMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ===== Back to Top Button =====
window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY;
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.navbar-menu a[href="#${sectionId}"]`);

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Menu Items Animation on Scroll =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe menu items
    menuItems.forEach(item => observer.observe(item));

    // Observe other animated elements
    document.querySelectorAll('.feature-card, .special-card, .testimonial-card, .stat-card, .info-item').forEach(el => {
        observer.observe(el);
    });

    // Observe section titles
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
}

// ===== Menu Filter Functionality =====
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            menuItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 50);
                    visibleCount++;
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Announce to screen readers
            announceToScreenReader(`Showing ${visibleCount} items in ${filter} category`);
        });
    });
}

// ===== Toast Notification System =====
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}" aria-hidden="true"></i>
        <span>${message}</span>
        <button class="toast-close" aria-label="Close notification"><i class="fas fa-times" aria-hidden="true"></i></button>
    `;

    if (toastContainer) {
        toastContainer.appendChild(toast);

        // Trigger reflow for animation
        toast.offsetHeight;

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto remove
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
}

function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
}

// ===== Announce to Screen Readers =====
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// ===== Quick Add to Cart =====
document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const itemName = btn.dataset.item || 'Item';
        const itemPrice = parseFloat(btn.dataset.price) || 0;
        
        // Add to cart
        addToCart(itemName, itemPrice);
        
        // Button animation
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-plus"></i>';
            btn.disabled = false;
        }, 1500);
        
        showToast(`${itemName} added to cart! 🛒`, 'success');
    });
});

// ===== Favorite Button =====
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        
        const itemName = btn.closest('.menu-item')?.querySelector('.menu-item-name')?.textContent || 'Item';
        const icon = btn.querySelector('i');
        
        if (btn.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            addToFavorites(itemName);
            showToast(`${itemName} added to favorites! ❤️`, 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            removeFromFavorites(itemName);
            showToast(`${itemName} removed from favorites`, 'info');
        }
    });
});

// ===== Favorites Management =====
function addToFavorites(itemName) {
    if (!favorites.includes(itemName)) {
        favorites.push(itemName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(itemName) {
    favorites = favorites.filter(fav => fav !== itemName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function restoreFavorites() {
    favorites.forEach(favName => {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const itemName = btn.closest('.menu-item')?.querySelector('.menu-item-name')?.textContent;
            if (itemName === favName) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        });
    });
}

// ===== Special Order Buttons =====
document.querySelectorAll('.special-order').forEach(btn => {
    btn.addEventListener('click', () => {
        const itemName = btn.dataset.item || 'Special Item';
        const itemPrice = parseFloat(btn.dataset.price) || 0;
        
        addToCart(itemName, itemPrice);
        showToast(`${itemName} added to cart! 🎉`, 'success');
    });
});

// ===== Add to Cart Function =====
function addToCart(name, price) {
    const cartItem = {
        name,
        price,
        id: Date.now(),
        quantity: 1
    };
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(cartItem);
    }
    
    cartTotal += price;
    updateCartCount();
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 300);
        }
    }
}

// ===== Form Validation & Submission =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.innerHTML;
        
        // Validate form
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone').trim();
        const subject = formData.get('subject').trim();
        
        // Validation checks
        if (!name || name.length < 2) {
            showToast('Please enter a valid name (at least 2 characters)', 'error');
            return;
        }
        
        if (!email || !validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (!phone || phone.length < 10) {
            showToast('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        if (!subject) {
            showToast('Please select a subject', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data (in production, send to server)
        console.log('Form submitted:', { name, email, phone, subject });
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnText;
        
        // Clear focused state
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused');
        });
        
        showToast('Message sent successfully! We\'ll get back to you soon. 📧', 'success');
        announceToScreenReader('Your message has been sent successfully');
    });
}

// ===== Email Validation Function =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== Newsletter Form =====
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button');
        const email = emailInput.value.trim();
        
        if (!email || !validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate subscription
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        emailInput.value = '';
        
        showToast('Successfully subscribed! Check your email for a welcome offer. 🎁', 'success');
        announceToScreenReader('You have been successfully subscribed to our newsletter');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
        }, 3000);
    });
}

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        const parallaxEffect = scrolled * 0.5;
        hero.style.backgroundPositionY = parallaxEffect + 'px';
    }
});

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - easeOutQuart
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = target * easeOutQuart;
        
        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ===== Animate Hero Stats =====
function animateHeroStats() {
    const heroStatNumbers = document.querySelectorAll('.hero-stat-number');
    
    heroStatNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        if (target) {
            animateCounter(stat, target, 2500);
        }
    });
}

// ===== Observe stat cards =====
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseFloat(entry.target.dataset.target);
            if (target && entry.target.textContent === '0') {
                animateCounter(entry.target, target, 2000);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Typing Effect for Hero Subtitle =====
function startTypingEffect() {
    const typedText = document.getElementById('typedText');
    if (!typedText) return;
    
    const phrases = [
        'The Taste You Never Taste Before!',
        'Authentic Indian Flavors!',
        'Made with Love & Passion!',
        '45,000+ Happy Customers!'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ===== Special Timer =====
function initSpecialTimer() {
    const timerElements = document.querySelectorAll('[id$="Timer"]');
    
    timerElements.forEach(timerElement => {
        let hours = 5;
        let minutes = 0;
        let seconds = 0;
        
        function updateTimer() {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }
            
            const formattedTime = 
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
            
            timerElement.textContent = '⏱️ ' + formattedTime;
            timerElement.setAttribute('aria-label', `${hours} hours ${minutes} minutes ${seconds} seconds remaining`);
            
            if (hours === 0 && minutes === 0 && seconds === 0) {
                timerElement.textContent = '⏱️ EXPIRED';
                timerElement.closest('.special-card')?.classList.add('expired');
                return;
            }
            
            setTimeout(updateTimer, 1000);
        }
        
        updateTimer();
    });
}

// ===== Testimonials Slider =====
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    
    if (!slider) return;
    
    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    const dotsContainer = document.getElementById('testimonialsDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.setAttribute('role', 'button');
            dot.tabIndex = 0;
            dot.addEventListener('click', () => goToSlide(i));
            dot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(i);
                }
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateSlider() {
        cards.forEach((card, index) => {
            const offset = (index - currentIndex) * 100;
            card.style.transform = `translateX(${offset}%)`;
            card.style.opacity = index === currentIndex ? '1' : '0.5';
            card.style.pointerEvents = index === currentIndex ? 'auto' : 'none';
        });
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Announce to screen readers
        announceToScreenReader(`Showing testimonial ${currentIndex + 1} of ${totalSlides}`);
    }
    
    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        updateSlider();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                prevSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nextSlide();
            }
        });
    }
    
    // Auto-slide
    let autoSlideTimer = setInterval(nextSlide, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    slider.addEventListener('mouseleave', () => {
        autoSlideTimer = setInterval(nextSlide, 5000);
    });
    
    // Initialize
    updateSlider();
}

// ===== Video Modal =====
if (watchVideoBtn) {
    watchVideoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (videoModal && videoFrame) {
            videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            announceToScreenReader('Video modal opened');
        }
    });
}

if (closeVideoModal) {
    closeVideoModal.addEventListener('click', closeVideoModalFunc);
}

if (videoModal) {
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModalFunc();
        }
    });
}

function closeVideoModalFunc() {
    if (videoModal && videoFrame) {
        videoModal.classList.remove('active');
        videoFrame.src = '';
        document.body.style.overflow = 'auto';
        announceToScreenReader('Video modal closed');
    }
}

// ===== Escape Key to Close Modal =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModalFunc();
        
        // Close mobile menu
        if (menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ===== Create Flame Particles =====
function createFlameParticles() {
    const logoImg = document.querySelector('.logo-img');
    if (!logoImg) return;
    
    // Clear existing particles
    const existingParticles = logoImg.querySelectorAll('.flame-particle');
    existingParticles.forEach(p => p.remove());
}

// ===== Image Lazy Loading =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Focus trap for mobile menu
    if (navbarMenu && navbarMenu.classList.contains('active')) {
        const focusableElements = navbarMenu.querySelectorAll('a, button');
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
});

// ===== Form Input Animations =====
function initFormInteractions() {
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// ===== Ripple Effect for Buttons =====
document.querySelectorAll('.btn-primary, .btn-secondary, .filter-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Only create ripple for mouse clicks
        if (e.clientX === 0 && e.clientY === 0) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Helper Function: Check if Element is in Viewport =====
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== Performance Optimization: Debounce Function =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Debounced Scroll Handler =====
const debouncedScrollHandler = debounce(() => {
    updateActiveNav();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// ===== Initialize Everything on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add visible class to elements already in view
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach((item, index) => {
            if (isElementInViewport(item)) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            }
        });
    }, 100);
    
    // Initialize active nav link
    updateActiveNav();
    
    // Log initialization
    console.log('🔥 Taste Ka Tadka - Website Initialized Successfully!');
});

// ===== Console Welcome Message =====
if (!window.location.hostname.includes('localhost')) {
    console.clear();
}

console.log('%c🔥 Taste Ka Tadka 🔥', 'font-size: 24px; font-weight: bold; color: #FF6600; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cThe Taste You Never Taste Before!', 'font-size: 14px; color: #FFB800; font-weight: 600;');
console.log('%cMade with ❤️ in India | Version 1.0.0', 'font-size: 12px; color: #3E2723;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6600;');

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js').then(
        //     () => console.log('✅ Service Worker registered'),
        //     (error) => console.log('❌ Service Worker registration failed:', error)
        // );
    });
}

// ===== Detect Performance Issues =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
    });
}
