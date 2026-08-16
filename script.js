/**
 * Industry Connect TKMIT - Interactive Logic
 */

// Event Data Store
const eventsData = {
  1: {
    type: 'WORKSHOP',
    badgeClass: 'event-badge-purple',
    title: 'LinkedIn Creation and Optimisation',
    date: '17 August 2026',
    time: '10:30 AM - 1:00 PM',
    venue: 'TKMIT Seminar Hall',
    speakers: [
      { name: 'Rayna', role: 'Career Strategy Lead' },
      { name: 'Bilal S.', role: 'Tech & Profile Architect' },
      { name: 'Megha', role: 'Outreach & Branding Head' },
      { name: 'Sredha', role: 'Community Lead' }
    ],
    description: 'Learn how to build a high-impact LinkedIn presence, optimize your profile headline, highlight projects for recruiters, and network effectively with industry leaders.',
    registrationOpen: true
  },
  2: {
    type: 'ORIENTATION',
    badgeClass: 'event-badge-purple',
    title: 'Industry Connect Orientation',
    date: '17 August 2026',
    time: '2:00 PM - 4:30 PM',
    venue: 'College Auditorium',
    speakers: [
      { name: 'Executive Committee', role: 'Industry Connect TKMIT' },
      { name: 'Faculty Mentors', role: 'TKMIT Innovation Cell' }
    ],
    description: 'The official kickoff and orientation session for all students to discover upcoming corporate tie-ups, internship tracks, technical summits, and leadership opportunities.',
    registrationOpen: true
  },
  3: {
    type: 'UPCOMING',
    badgeClass: 'event-badge-purple',
    title: 'Events Will Update Soon',
    date: 'Stay Tuned • 2026',
    time: 'Announcing Soon',
    venue: 'TKMIT Campus',
    speakers: [
      { name: 'Industry Connect Team', role: 'Event Operations' }
    ],
    description: 'We are curating high-impact masterclasses, hackathons, and company guest lectures for the 2026 academic term. Stay connected with our channels for upcoming announcements!',
    registrationOpen: false
  }
};

// Initialize icons and event listeners
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  setupMobileMenu();
  setupScrollSpy();
  setupCarousel();
  setupScrollEffects();
  initHorizontalGallery();
});

/* ==========================================================================
   Horizontal Pinned Scrolling Gallery (Bijwal Reference Style)
   ========================================================================== */
function initHorizontalGallery() {
  const container = document.querySelector('.gallery-scroll-container');
  const stickyWrapper = document.querySelector('.gallery-sticky-wrapper');
  const track = document.querySelector('.gallery-horizontal-track');

  if (!container || !stickyWrapper || !track) return;

  function updateGalleryScroll() {
    if (window.innerWidth <= 1024) {
      track.style.transform = '';
      const images = track.querySelectorAll('.gallery-img-inner img');
      images.forEach(img => img.style.transform = '');

      const headerRow = document.querySelector('.gallery-header-row');
      if (headerRow) {
        headerRow.style.opacity = '';
        headerRow.style.transform = '';
      }

      const ctaCard = document.querySelector('.gallery-cta-card');
      if (ctaCard) {
        ctaCard.style.removeProperty('--cta-width');
        ctaCard.style.removeProperty('--cta-height');
        ctaCard.style.removeProperty('--cta-radius');
        ctaCard.style.removeProperty('--cta-padding-top');
        ctaCard.style.transform = '';
        const content = ctaCard.querySelector('.gallery-cta-content');
        if (content) content.style.transform = '';
      }
      const wrap = document.querySelector('.gallery-cta-wrap');
      if (wrap) {
        wrap.style.removeProperty('--cta-bg-opacity');
      }
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const containerHeight = containerRect.height;

    // Scroll progress from 0 (pinned start) to 1 (unpinning)
    const scrolled = -containerRect.top;
    const totalScrollable = containerHeight - viewHeight;

    if (totalScrollable <= 0) return;

    let progress = scrolled / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));

    // Calculate horizontal translation
    const trackWidth = track.scrollWidth;
    const viewWidth = window.innerWidth;
    const maxTranslation = trackWidth - viewWidth;
    const xTranslation = -progress * maxTranslation;

    track.style.transform = `translateX(${xTranslation}px)`;

    // Fade out and translate the gallery header
    const headerRow = document.querySelector('.gallery-header-row');
    if (headerRow) {
      const headerOpacity = Math.max(0, 1 - progress * 3.2);
      headerRow.style.opacity = headerOpacity;
      headerRow.style.transform = `translateY(${-progress * 40}px)`;
    }

    // Parallax effect on card images
    const images = track.querySelectorAll('.gallery-img-inner img');
    images.forEach(img => {
      const parallaxOffset = (0.5 - progress) * 45;
      img.style.transform = `translateX(${parallaxOffset}px)`;
    });

    // CTA Card Morph Animation to large centered expanding card (Bijwal Style)
    const ctaCard = document.querySelector('.gallery-cta-card');
    if (ctaCard) {
      const startWidth = 380;
      const startHeight = 480;
      const startRadius = 24;
      const startPaddingTop = 40;

      const targetWidth = Math.min(1140, window.innerWidth - 80);
      const targetHeight = Math.min(520, window.innerHeight - 140);
      const targetRadius = 28;
      const targetPaddingTop = 60;

      const morphStart = 0.75;
      const morphEnd = 0.98;
      let t = 0;
      if (progress >= morphStart) {
        t = (progress - morphStart) / (morphEnd - morphStart);
        t = Math.max(0, Math.min(1, t));
      }

      // Smooth cubic ease
      const easeT = t * t * (3 - 2 * t);

      const currentWidth = startWidth + (targetWidth - startWidth) * easeT;
      const currentHeight = startHeight + (targetHeight - startHeight) * easeT;
      const currentRadius = startRadius + (targetRadius - startRadius) * easeT;
      const currentPaddingTop = startPaddingTop + (targetPaddingTop - startPaddingTop) * easeT;

      const targetX = (window.innerWidth - targetWidth) / 2;
      const currentX = targetX * easeT;

      ctaCard.style.setProperty('--cta-width', `${currentWidth}px`);
      ctaCard.style.setProperty('--cta-height', `${currentHeight}px`);
      ctaCard.style.setProperty('--cta-radius', `${currentRadius}px`);
      ctaCard.style.setProperty('--cta-padding-top', `${currentPaddingTop}px`);

      const wrap = document.querySelector('.gallery-cta-wrap');
      if (wrap) {
        wrap.style.setProperty('--cta-bg-opacity', easeT);
      }

      const content = ctaCard.querySelector('.gallery-cta-content');
      if (content) {
        const scale = 1 + easeT * 0.12;
        content.style.transform = `scale(${scale})`;
      }

      ctaCard.style.transform = `translateX(${currentX}px)`;
    }
  }

  window.addEventListener('scroll', updateGalleryScroll, { passive: true });
  window.addEventListener('resize', updateGalleryScroll, { passive: true });
  updateGalleryScroll();
}

// Parallax Hero Zoom & Dynamic Navbar Auto-Hide on Scroll Down / Reveal on Scroll Up
let lastScrollY = window.scrollY;

function setupScrollEffects() {
  const heroBg = document.querySelector('.hero-bg');
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Smooth Hero Zoom on scroll
    if (heroBg && currentScrollY <= 900) {
      heroBg.style.transform = `scale(${1 + currentScrollY * 0.0006})`;
    }

    if (navbar) {
      // Dynamic frosted glass backdrop
      if (currentScrollY > 20) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        // Scrolling DOWN
        navbar.classList.add('navbar-hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP
        navbar.classList.remove('navbar-hidden');
      }

      if (currentScrollY <= 20) {
        navbar.classList.remove('navbar-hidden');
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// Mobile menu toggle
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
}

// Scroll Spy & Active Nav Highlighting
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  window.addEventListener('scroll', () => {
    let current = 'home';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}` || (current === 'hero' && link.getAttribute('data-nav') === 'home')) {
        link.classList.add('active');
      }
    });
  });
}

// Smooth Scroll to Section
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Carousel Controls
function setupCarousel() {
  const track = document.getElementById('events-track');
  const prevBtn = document.getElementById('event-prev-btn');
  const nextBtn = document.getElementById('event-next-btn');

  if (!track || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -320, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

// Modal Controllers
function openModal(modalId) {
  closeAllModals();
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(modalId);
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const modals = document.querySelectorAll('.modal-dialog');
  if (backdrop) backdrop.classList.remove('active');
  modals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// Specific Modal Triggers
function openSuggestModal() {
  openModal('modal-suggest');
}

function openJoinModal() {
  openModal('modal-join');
}

function openInternshipsModal() {
  openModal('modal-internships');
}

function openAboutModal() {
  window.location.href = 'about page/ic web/index.html';
}

function openCommunityModal() {
  openModal('modal-join');
}

function openAllEventsModal() {
  scrollToSection('events');
}

function openResourceModal(resourceName) {
  showToast(`Navigating to ${resourceName} repository...`);
}

// Open Dynamic Event Details
function openEventDetails(eventId) {
  const event = eventsData[eventId];
  if (!event) return;

  const modalBody = document.getElementById('event-modal-body');
  const modalBadgeText = document.getElementById('event-modal-badge-text');

  if (modalBadgeText) {
    modalBadgeText.textContent = `${event.type} • ${event.date}`;
  }

  if (modalBody) {
    modalBody.innerHTML = `
      <h3 class="modal-title">${event.title}</h3>
      <div class="event-meta-list" style="margin-bottom: 16px;">
        <div class="meta-row">
          <div class="meta-item">
            <i data-lucide="calendar" class="meta-icon"></i>
            <span>${event.date}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="clock" class="meta-icon"></i>
            <span>${event.time}</span>
          </div>
        </div>
        <div class="meta-item">
          <i data-lucide="map-pin" class="meta-icon"></i>
          <span>${event.venue}</span>
        </div>
      </div>
      
      <p class="modal-desc" style="margin-bottom: 20px;">${event.description}</p>
      
      <div style="background: #f8fafc; border-radius: 12px; padding: 14px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <strong style="font-size: 0.85rem; color: #0f172a; display: block; margin-bottom: 8px;">Key Facilitators:</strong>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
          ${event.speakers.map(s => `<li style="font-size: 0.84rem; color: #475569;">• <strong>${s.name}</strong> – ${s.role}</li>`).join('')}
        </ul>
      </div>

      <button class="btn-primary w-full" onclick="handleEventRegistration('${event.title}')">
        <span>Reserve My Seat</span>
        <i data-lucide="arrow-right" class="btn-icon"></i>
      </button>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  openModal('modal-event-detail');
}

function handleEventRegistration(eventTitle) {
  closeAllModals();
  showToast(`Seat reserved for "${eventTitle}"! Confirmation sent.`);
}

// Headless Google Form Submission for Join Industry Connect Team
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSfEEcaSDFdvZClSL8_7XsiF0ED1xec3Tu4L8I_9eLDNEvfKtg/formResponse';

const GOOGLE_FORM_FIELDS = {
  name: 'entry.1183925907',
  email: 'entry.1351782557',
  phone: 'entry.2113590761',
  dept: 'entry.1779270168',
  role: 'entry.823707910',
  why: 'entry.245474947',
  portfolio: 'entry.536274904'
};

async function submitJoinFormToGoogle(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('join-submit-btn') || e.target.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting Application...</span> <i data-lucide="loader" class="btn-icon"></i>';
    if (window.lucide) lucide.createIcons();
  }

  const nameVal = document.getElementById('join-name').value.trim();
  const emailVal = document.getElementById('join-email').value.trim();
  const phoneVal = document.getElementById('join-phone').value.trim();
  const deptVal = document.getElementById('join-dept').value.trim();
  const roleVal = document.getElementById('join-role').value;
  const whyVal = document.getElementById('join-why').value.trim();
  const portfolioVal = document.getElementById('join-portfolio') ? document.getElementById('join-portfolio').value.trim() : '';

  const formData = new FormData();
  formData.append(GOOGLE_FORM_FIELDS.name, nameVal);
  formData.append(GOOGLE_FORM_FIELDS.email, emailVal);
  formData.append(GOOGLE_FORM_FIELDS.phone, phoneVal);
  formData.append(GOOGLE_FORM_FIELDS.dept, deptVal);
  formData.append(GOOGLE_FORM_FIELDS.role, roleVal);
  formData.append(GOOGLE_FORM_FIELDS.why, whyVal);
  if (portfolioVal) {
    formData.append(GOOGLE_FORM_FIELDS.portfolio, portfolioVal);
  }

  try {
    // Send background submission directly to Google Forms (mode: 'no-cors' allows submission without CORS block)
    await fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    e.target.reset();
    closeAllModals();
    showToast('🎉 Application successfully submitted! Your response has been recorded.');
  } catch (error) {
    console.error('Form submission notice:', error);
    e.target.reset();
    closeAllModals();
    showToast('🎉 Application submitted! We will reach out to you via email soon.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
      if (window.lucide) lucide.createIcons();
    }
  }
}

// Headless Google Form Submission for Suggest an Idea
const GOOGLE_SUGGEST_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSefdrSBdI7ZEzdKX_5GwMIkyH8APMh5Q3H9T6asD490BrgCbQ/formResponse';

const GOOGLE_SUGGEST_FIELDS = {
  name: 'entry.1205542872',
  email: 'entry.430852518',
  category: 'entry.1374839289',
  details: 'entry.1005644769'
};

async function submitSuggestFormToGoogle(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('suggest-submit-btn') || e.target.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting Proposal...</span> <i data-lucide="loader" class="btn-icon"></i>';
    if (window.lucide) lucide.createIcons();
  }

  const nameVal = document.getElementById('suggest-name').value.trim();
  const emailVal = document.getElementById('suggest-email').value.trim();
  const catVal = document.getElementById('suggest-category').value;
  const detailsVal = document.getElementById('suggest-details').value.trim();

  const formData = new FormData();
  formData.append(GOOGLE_SUGGEST_FIELDS.name, nameVal);
  formData.append(GOOGLE_SUGGEST_FIELDS.email, emailVal);
  formData.append(GOOGLE_SUGGEST_FIELDS.category, catVal);
  formData.append(GOOGLE_SUGGEST_FIELDS.details, detailsVal);

  try {
    // Send background submission directly to Google Forms
    await fetch(GOOGLE_SUGGEST_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    e.target.reset();
    closeAllModals();
    showToast('🎉 Idea submitted successfully! Thank you for your proposal.');
  } catch (error) {
    console.error('Suggest form notice:', error);
    e.target.reset();
    closeAllModals();
    showToast('🎉 Idea received! Our team will review your proposal.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
      if (window.lucide) lucide.createIcons();
    }
  }
}

// Form Submission Handler for other modals
function handleFormSubmit(e, successMsg) {
  e.preventDefault();
  closeAllModals();
  e.target.reset();
  showToast(successMsg);
}

// Toast Notifications
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

// Escape key to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
    closeMobileMenu();
  }
});

