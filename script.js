/* ============================================================
   AWANDE ZUNGU - PORTFOLIO JAVASCRIPT
   Interactivity, Animations & Effects
   ============================================================ */

(function () {
  'use strict';

  // ==================== DOM ELEMENTS ====================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

  const header = $('#header');
  const navToggle = $('#nav-toggle');
  const mobileMenu = $('#mobile-menu');
  const mobileLinks = $$('.mobile-menu__link');
  const navLinks = $$('.nav__link');
  const backToTop = $('#back-to-top');
  const contactForm = $('#contact-form');
  const formSuccess = $('#form-success');
  const sendAnother = $('#send-another');
  const cursorDot = $('#cursor-dot');
  const cursorOutline = $('#cursor-outline');
  const particlesCanvas = $('#particles-canvas');

  // ==================== CUSTOM CURSOR ====================
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';

      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effect on interactive elements
    const hoverTargets = $$('a, button, .tech-chip, .project-card, .contact__channel');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorOutline.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorOutline.classList.remove('hovering');
      });
    });
  }

  // ==================== PARTICLE BACKGROUND ====================
  function initParticles() {
    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));

    function resize() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ==================== HEADER SCROLL EFFECT ====================
  function initHeaderScroll() {
    let lastScroll = 0;

    function onScroll() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Back to top button
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }

      lastScroll = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================== ACTIVE NAV LINK ON SCROLL ====================
  function initActiveNav() {
    const sections = $$('section[id]');

    function onScroll() {
      const scrollY = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          // Desktop nav
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
              link.classList.add('active');
            }
          });

          // Mobile nav
          mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ==================== SMOOTH SCROLL ====================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
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

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== SCROLL REVEAL ANIMATIONS ====================
  function initScrollReveal() {
    const reveals = $$('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ==================== COUNTER ANIMATION ====================
  function initCounters() {
    const counters = $$('.about__stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.count);
          let current = 0;
          const increment = target / 40;
          const duration = 1500;
          const stepTime = duration / 40;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ==================== CONTACT FORM ====================
  function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/>
        </svg>
        <span>Sending...</span>
      `;
      submitBtn.disabled = true;

      // Add spinning animation
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('active');
        contactForm.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        style.remove();
      }, 1500);
    });

    sendAnother.addEventListener('click', () => {
      formSuccess.classList.remove('active');
      contactForm.style.display = 'flex';
    });
  }

  // ==================== TYPEWRITER EFFECT FOR SUBTITLE ====================
  function initTypewriter() {
    const subtitle = $('.hero__subtitle');
    if (!subtitle) return;

    const words = [
      'Computer Science Student',
      'Aspiring Full-Stack Developer',
      'Problem Solver',
      'UI/UX Enthusiast'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isPaused) {
        setTimeout(type, 2000);
        isPaused = false;
        isDeleting = true;
        return;
      }

      if (!isDeleting) {
        charIndex++;
        subtitle.innerHTML = `${currentWord.substring(0, charIndex)}<span class="typewriter-cursor">|</span>`;

        if (charIndex === currentWord.length) {
          isPaused = true;
          setTimeout(type, 100);
          return;
        }

        setTimeout(type, 60 + Math.random() * 40);
      } else {
        charIndex--;
        subtitle.innerHTML = `${currentWord.substring(0, charIndex)}<span class="typewriter-cursor">|</span>`;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 400);
          return;
        }

        setTimeout(type, 30);
      }
    }

    // Add cursor style
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .typewriter-cursor {
        color: #14b8a6;
        font-weight: 300;
        animation: blink 0.7s step-end infinite;
        margin-left: 2px;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(cursorStyle);

    // Start after a delay
    setTimeout(type, 1500);
  }

  // ==================== TILT EFFECT ON PROJECT CARDS ====================
  function initTiltEffect() {
    const cards = $$('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==================== INITIALIZE ====================
  function init() {
    initCursor();
    initParticles();
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initContactForm();
    initTypewriter();
    initTiltEffect();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();