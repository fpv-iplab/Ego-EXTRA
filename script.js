// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tab functionality for examples section
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const targetTab = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Download button functionality
const downloadBtns = document.querySelectorAll('.download-btn');

downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add loading state
        btn.classList.add('loading');
        btn.disabled = true;
        
        // Simulate download process
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.disabled = false;
            
            // Show download notification
            showNotification('Download started! Check your downloads folder.');
        }, 2000);
    });
});

// Copy BibTeX functionality
function copyBibtex() {
    const bibtexElement = document.getElementById('bibtex');
    const bibtexText = bibtexElement.textContent;
    
    // Create a temporary textarea element
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = bibtexText;
    document.body.appendChild(tempTextarea);
    
    // Select and copy the text
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showNotification('BibTeX copied to clipboard!');
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(bibtexText).then(() => {
            showNotification('BibTeX copied to clipboard!');
        }).catch(() => {
            showNotification('Failed to copy BibTeX. Please select and copy manually.');
        });
    }
    
    // Remove the temporary element
    document.body.removeChild(tempTextarea);
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.overview-card, .download-card, .stat-item, .example-grid, .benchmark-table, .stat-card, .person-card, .stat-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isPercentage = element.textContent.includes('%');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            if (isPercentage) {
                element.textContent = target.toFixed(2) + '%';
            } else {
                element.textContent = target.toLocaleString();
            }
            clearInterval(timer);
        } else {
            if (isPercentage) {
                element.textContent = start.toFixed(2) + '%';
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const isPercentage = counter.textContent.includes('%');
            let target;
            
            if (isPercentage) {
                // Extract percentage value (e.g., "89.65%" -> 89.65)
                target = parseFloat(counter.textContent.replace('%', ''));
            } else {
                // Extract integer value (e.g., "45,198" -> 45198)
                target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            }
            
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-item h3');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Video placeholder click handlers
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', () => {
        showNotification('Video preview coming soon!');
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Tab key navigation for examples
    if (e.key === 'Tab' && e.target.classList.contains('tab-btn')) {
        const currentIndex = Array.from(tabBtns).indexOf(e.target);
        if (e.shiftKey) {
            // Shift + Tab - go to previous tab
            if (currentIndex > 0) {
                tabBtns[currentIndex - 1].focus();
            }
        } else {
            // Tab - go to next tab
            if (currentIndex < tabBtns.length - 1) {
                tabBtns[currentIndex + 1].focus();
            }
        }
    }
});

// Form validation for contact (if added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function to debounce scroll events
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

// Optimized scroll handler
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload critical images (if any are added)
function preloadImages() {
    const imageUrls = [
        'img/faces/FR.jpg',
        'img/faces/MM.jpg',
        'img/faces/AF.jpg',
        'img/faces/GMF.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('download-btn') && !this.classList.contains('copy-btn')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Initialize tooltips (if needed)
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
});

// Tooltip functionality
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.style.opacity = '0';
        setTimeout(() => {
            if (e.target._tooltip && e.target._tooltip.parentNode) {
                document.body.removeChild(e.target._tooltip);
            }
        }, 300);
    }
}

// Error handling for failed downloads
function handleDownloadError(btn, errorMessage = 'Download failed. Please try again.') {
    btn.classList.remove('loading');
    btn.disabled = false;
    showNotification(errorMessage);
}

// Add error handling to download buttons
downloadBtns.forEach(btn => {
    btn.addEventListener('error', () => {
        handleDownloadError(btn);
    });
});

// Performance optimization: Lazy load non-critical content
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            // Load content here if needed
            lazyLoadObserver.unobserve(element);
        }
    });
}, { rootMargin: '50px' });

// Add any lazy-loadable elements to the observer
document.addEventListener('DOMContentLoaded', () => {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach(el => {
        lazyLoadObserver.observe(el);
    });
});