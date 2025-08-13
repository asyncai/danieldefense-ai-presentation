let currentSlide = 1;
const totalSlides = 13;

document.addEventListener('DOMContentLoaded', () => {
    updateSlideCounter();
    updateProgressBar();
    initKeyboardControls();
    initTouchControls();
    preloadAnimations();
});

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    
    slides[currentSlide - 1].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide > totalSlides) {
        currentSlide = totalSlides;
    } else if (currentSlide < 1) {
        currentSlide = 1;
    }
    
    slides[currentSlide - 1].classList.add('active');
    
    updateSlideCounter();
    updateProgressBar();
    resetAnimations(slides[currentSlide - 1]);
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide - 1].classList.remove('active');
    
    currentSlide = slideNumber;
    slides[currentSlide - 1].classList.add('active');
    
    updateSlideCounter();
    updateProgressBar();
    resetAnimations(slides[currentSlide - 1]);
}

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('total-slides').textContent = totalSlides;
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = progressPercentage + '%';
}


function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add('fullscreen');
        });
    } else {
        document.exitFullscreen().then(() => {
            document.body.classList.remove('fullscreen');
        });
    }
}

function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                changeSlide(1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides);
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    toggleFullscreen();
                }
                closeHelp();
                break;
            case 'h':
            case 'H':
            case '?':
                showHelp();
                break;
            case 'g':
            case 'G':
                const slideNum = prompt('Go to slide number (1-' + totalSlides + '):');
                if (slideNum) {
                    const num = parseInt(slideNum);
                    if (!isNaN(num)) {
                        goToSlide(num);
                    }
                }
                break;
        }
        
        if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
        }
    });
}

function initTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide(1);
            } else {
                changeSlide(-1);
            }
        }
    }
}

function resetAnimations(slide) {
    const animatedElements = slide.querySelectorAll('.list-item, .bucket, .role-item, .timeline-item');
    
    animatedElements.forEach(element => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = '';
        }, 10);
    });
}

function preloadAnimations() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index !== 0) {
            // Remove inline styles to let CSS handle the visibility
            slide.style.transition = 'none';
            setTimeout(() => {
                slide.style.transition = '';
                slide.style.opacity = '';
                slide.style.transform = '';
            }, 100);
        }
    });
}

function showHelp() {
    document.getElementById('helpModal').classList.add('show');
}

function closeHelp() {
    document.getElementById('helpModal').classList.remove('show');
}

function copyPrompt(button) {
    const promptCode = button.previousElementSibling.querySelector('code');
    const promptText = promptCode.innerText.trim();
    
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.innerText = 'Failed';
        setTimeout(() => {
            button.innerText = 'Copy';
        }, 2000);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('slide') || e.target.classList.contains('slide-content')) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        if (x < width * 0.3) {
            changeSlide(-1);
        } else if (x > width * 0.7) {
            changeSlide(1);
        }
    }
});

let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    
    if (document.body.classList.contains('fullscreen')) {
        document.querySelector('.controls').style.opacity = '1';
        document.querySelector('.fullscreen-toggle').style.opacity = '1';
        
        idleTimer = setTimeout(() => {
            if (document.body.classList.contains('fullscreen')) {
                document.querySelector('.controls').style.opacity = '0';
                document.querySelector('.fullscreen-toggle').style.opacity = '0';
            }
        }, 3000);
    }
}

document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

console.log(`
====================================
Daniel Defense AI Executive Briefing
====================================
Presentation loaded successfully!

Keyboard shortcuts:
- Arrow keys or Space: Navigate slides
- F: Toggle fullscreen
- H or ?: Show help
- G: Go to specific slide
- Home/End: First/last slide

Total slides: ${totalSlides}
`);