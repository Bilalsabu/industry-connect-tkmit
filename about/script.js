// --- CONNECTIONS CANVAS BACKGROUND (VIBRANT LIGHT THEME NETWORKING) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 75;
const connectionDistance = 125;
let mouse = { x: null, y: null, radius: 160 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 1.5; // Slightly larger particles
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.alpha = Math.random() * 0.4 + 0.5; // Base particle alpha (0.5 - 0.9) to make them stand out locally
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off boundary edges
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    // Mouse interactive drift
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 0.35;
        this.y -= (dy / distance) * force * 0.35;
      }
    }
  }

  draw() {
    let currentAlpha = this.alpha * 0.1; // Default to 10% visibility
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance < mouse.radius) {
        const ratio = 1 - distance / mouse.radius;
        currentAlpha = this.alpha * (0.1 + ratio * 0.9);
      }
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < connectionDistance) {
        const baseAlpha = (1 - distance / connectionDistance) * 0.55; // Elevated base line alpha
        let alpha = baseAlpha * 0.1; // Default to 10% visibility
        
        if (mouse.x !== null && mouse.y !== null) {
          const avgX = (particles[i].x + particles[j].x) / 2;
          const avgY = (particles[i].y + particles[j].y) / 2;
          const distToMouse = Math.hypot(avgX - mouse.x, avgY - mouse.y);
          if (distToMouse < mouse.radius) {
            const ratio = 1 - distToMouse / mouse.radius;
            alpha = baseAlpha * (0.1 + ratio * 0.9);
          }
        }
        
        // Indigo stroke links
        ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
        ctx.lineWidth = 0.9; // Standard thin elegant lines
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Connect nodes to mouse pointer with dynamic spotlight scaling
    if (mouse.x !== null && mouse.y !== null) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const distance = Math.hypot(dx, dy);

      if (distance < mouse.radius) {
        const ratio = 1 - distance / mouse.radius;
        const alpha = ratio * 0.45; // Dynamic link opacity
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connect();
  requestAnimationFrame(animate);
}

initParticles();
animate();


// --- SCROLL REVEAL OBSERVER WITH STAGGERED SLIDE-IN ---
const revealElements = document.querySelectorAll('.reveal-up');

let revealQueue = [];
let revealTimeout;

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      revealQueue.push(entry.target);
      observer.unobserve(entry.target);
    }
  });

  if (revealQueue.length > 0) {
    clearTimeout(revealTimeout);
    revealTimeout = setTimeout(() => {
      // Stagger activation of all elements that entered the viewport in this frame
      revealQueue.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('active');
        }, index * 80); // Stagger by 80ms for a beautiful cascading feel
      });
      revealQueue = [];
    }, 30);
  }
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -20px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// --- CARD HOVER SUBTLE 3D TILT EFFECT ---
const cards = document.querySelectorAll('.member-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Very subtle 3D tilt calculation (-3.5 to 3.5 degrees max rotation)
    const rotateX = -(y - centerY) / 30;
    const rotateY = (x - centerX) / 30;
    
    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    
    // Spotlight position settings
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    card.style.setProperty('--shine-position', `${shineX}% ${shineY}%`);
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});


// --- INTERACTIVE MODAL INTERACTIVITY ---
const modal = document.getElementById('construction-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const constructLinks = document.querySelectorAll('.nav-construct-link');

// Function to open construction notice
function openModal(e) {
  e.preventDefault();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// Function to close construction notice
function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

// Attach event listeners to links
constructLinks.forEach(link => {
  link.addEventListener('click', openModal);
});

// Close click handlers
modalCloseBtn.addEventListener('click', closeModal);

// Close clicking backdrop
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close pressing Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// --- HERO GRAPHIC CURSOR PARALLAX INTERACTION ---
const heroHeader = document.getElementById('hero-header');
const graphicContainer = document.querySelector('.hero-graphic-container');
const buildingFrame = document.querySelector('.building-circle-frame');

if (heroHeader && graphicContainer && buildingFrame) {
  let isMoving = false;
  
  heroHeader.addEventListener('mousemove', (e) => {
    isMoving = true;
    const rect = heroHeader.getBoundingClientRect();
    // Cursor position relative to center of the hero section
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates (-1 to 1)
    const normX = mouseX / (rect.width / 2);
    const normY = mouseY / (rect.height / 2);
    
    // Smooth translation offsets
    const moveXContainer = normX * 12;
    const moveYContainer = normY * 12;
    const moveXFrame = normX * -6;
    const moveYFrame = normY * -6;
    
    // Apply immediate transform on hover (transition handles smoothing)
    graphicContainer.style.transform = `translate(${moveXContainer}px, ${moveYContainer}px)`;
    buildingFrame.style.transform = `translate(${moveXFrame}px, ${moveYFrame}px)`;
  });
  
  heroHeader.addEventListener('mouseleave', () => {
    isMoving = false;
    // Set a transition class/style for spring back, then reset
    graphicContainer.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    buildingFrame.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    
    graphicContainer.style.transform = 'translate(0, 0)';
    buildingFrame.style.transform = 'translate(0, 0)';
    
    setTimeout(() => {
      // Clear transitions to resume active mouse tracking styles from CSS
      if (!isMoving) {
        graphicContainer.style.transition = '';
        buildingFrame.style.transition = '';
      }
    }, 800);
  });
}

// --- PREMIUM DARK MODE TOGGLE INTERACTIVITY ---
const themeToggle = document.getElementById('theme-toggle');

// Function to set theme
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme('light'); // default theme
}

// Toggle event click handler
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

// --- PREMIUM ROTATING GEAR CUSTOM CURSOR ---
const customCursor = document.getElementById('custom-cursor');

if (customCursor) {
  // Move custom cursor with mouse coordinates
  window.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
  });

  // Handle cursor visibility when leaving/entering browser window
  document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = '1';
  });

  // Scale custom cursor up when hovering over interactive elements
  const interactives = document.querySelectorAll('a, button, .member-card, .social-link-btn, .theme-toggle-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      customCursor.classList.remove('cursor-hover');
    });
  });
}

// --- DYNAMIC NAVBAR AUTO-HIDE ON SCROLL DOWN / REVEAL ON SCROLL UP ---
let aboutLastScrollY = window.scrollY;
const aboutNavbar = document.getElementById('main-nav') || document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (aboutNavbar) {
    if (currentScrollY > 20) {
      aboutNavbar.classList.add('navbar-scrolled');
    } else {
      aboutNavbar.classList.remove('navbar-scrolled');
    }

    if (currentScrollY > aboutLastScrollY && currentScrollY > 90) {
      aboutNavbar.classList.add('navbar-hidden');
    } else if (currentScrollY < aboutLastScrollY) {
      aboutNavbar.classList.remove('navbar-hidden');
    }

    if (currentScrollY <= 20) {
      aboutNavbar.classList.remove('navbar-hidden');
    }
  }
  aboutLastScrollY = currentScrollY;
}, { passive: true });

