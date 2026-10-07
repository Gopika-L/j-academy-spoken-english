const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const scrollTopBtn = document.querySelector('.scroll-top');
const currentYearNode = document.getElementById('currentYear');
const enquiryForm = document.getElementById('enquiryForm');
const formMessage = document.querySelector('.form-message');
const header = document.querySelector('.site-header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (currentYearNode) {
  currentYearNode.textContent = new Date().getFullYear();
}

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const highlightActiveLink = () => {
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute('href');
    const isActive = target === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
};

window.addEventListener('scroll', highlightActiveLink, { passive: true });
window.addEventListener('load', highlightActiveLink);

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const galleryImages = [...document.querySelectorAll('.gallery-item img')];
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const closeBtn = document.querySelector('.lightbox-close');
let activeImageIndex = 0;

const openLightbox = (index) => {
  if (!lightbox || !lightboxImage || !galleryImages.length) return;

  activeImageIndex = index;
  lightboxImage.src = galleryImages[index].dataset.src || galleryImages[index].src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

galleryImages.forEach((image, index) => {
  image.addEventListener('click', () => openLightbox(index));
});

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[activeImageIndex].dataset.src || galleryImages[activeImageIndex].src;
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[activeImageIndex].dataset.src || galleryImages[activeImageIndex].src;
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;

  if (event.key === 'Escape') closeLightbox();

  if (event.key === 'ArrowRight') {
    activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[activeImageIndex].dataset.src || galleryImages[activeImageIndex].src;
  }

  if (event.key === 'ArrowLeft') {
    activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[activeImageIndex].dataset.src || galleryImages[activeImageIndex].src;
  }
});

if (scrollTopBtn) {
  const toggleScrollButton = () => {
    if (window.scrollY > 540) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const showFormMessage = (message, type) => {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.classList.remove('error', 'success');
  formMessage.classList.add(type);
};

const validateName = (value) => value.trim().length >= 2;
const validatePhone = (value) => /^\d{10,15}$/.test(value.replace(/\s+/g, ''));
const validateSelect = (value) => value.trim() !== '';
const validateMessage = (value) => value.trim().length >= 5;

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(enquiryForm);
    const fullName = String(formData.get('fullName') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const course = String(formData.get('course') || '').trim();
    const learningPreference = String(formData.get('learningPreference') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!validateName(fullName)) {
      showFormMessage('Please enter your full name.', 'error');
      document.getElementById('fullName').focus();
      return;
    }

    if (!validatePhone(phone)) {
      showFormMessage('Please enter a valid phone number.', 'error');
      document.getElementById('phone').focus();
      return;
    }

    if (!validateSelect(course)) {
      showFormMessage('Please select the course you are interested in.', 'error');
      document.getElementById('course').focus();
      return;
    }

    if (!validateSelect(learningPreference)) {
      showFormMessage('Please choose your learning preference.', 'error');
      document.getElementById('learningPreference').focus();
      return;
    }

    if (!validateMessage(message)) {
      showFormMessage('Please add a short message about your enquiry.', 'error');
      document.getElementById('message').focus();
      return;
    }

    showFormMessage('Thank you! Your enquiry has been received. We will get in touch with you.', 'success');
    enquiryForm.reset();
  });
}

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

if (!reducedMotion && !isTouchDevice) {
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursorGlow';
  document.body.appendChild(cursorGlow);

  document.addEventListener('pointermove', (event) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  document.addEventListener('pointerleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      const moveX = offsetX * 0.12;
      const moveY = offsetY * 0.12;
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 7;
      const rotateX = (0.5 - py) * 7;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

if (!reducedMotion && window.innerWidth > 768) {
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 48;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.4 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 + 0.08,
        alpha: Math.random() * 0.45 + 0.12
      });
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = `rgba(103, 216, 255, ${particle.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(103, 216, 255, 0.8)';
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(renderParticles);
    };

    requestAnimationFrame(renderParticles);
  }
}
