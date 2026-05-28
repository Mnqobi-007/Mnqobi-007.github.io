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
  const particlesCanvas = $('#particles-canvas');

  // ==================== CUSTOM CURSOR ====================
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursorDot = $('#cursor-dot');
    const cursorOutline = $('#cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

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
    if (!particlesCanvas) return;
    
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
      if (!ctx) return;
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
    if (!header) return;
    
    function onScroll() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Back to top button
      if (backToTop) {
        if (scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Call once to set initial state
    onScroll();
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    
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
    if (!sections.length) return;

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
    // Call once to set initial active state
    onScroll();
  }

  // ==================== SMOOTH SCROLL ====================
  function initSmoothScroll() {
    const allLinks = $$('a[href^="#"]');
    
    allLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip empty or home-only links
        if (href === '#' || href === '#home' || href === '#/') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==================== SCROLL REVEAL ANIMATIONS ====================
  function initScrollReveal() {
    const reveals = $$('.reveal-up, .reveal-left, .reveal-right');
    if (!reveals.length) return;

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
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.count);
          let current = 0;
          const increment = target / 40;
          const stepTime = 1500 / 40;

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

  // ==================== TYPEWRITER EFFECT ====================
  function initTypewriter() {
    const subtitleSpan = $('#typewriter-subtitle');
    if (!subtitleSpan) return;

    const words = [
      'Spring Boot Developer',
      'Full-Stack Engineer', 
      'Hanno Rund Award Winner',
      'CS Student @ UKZN',
      'Problem Solver'
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
        subtitleSpan.innerHTML = `${currentWord.substring(0, charIndex)}<span class="typewriter-cursor">|</span>`;

        if (charIndex === currentWord.length) {
          isPaused = true;
          setTimeout(type, 100);
          return;
        }

        setTimeout(type, 60 + Math.random() * 40);
      } else {
        charIndex--;
        subtitleSpan.innerHTML = `${currentWord.substring(0, charIndex)}<span class="typewriter-cursor">|</span>`;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 400);
          return;
        }

        setTimeout(type, 30);
      }
    }

    // Add cursor style if not already present
    if (!document.querySelector('#typewriter-styles')) {
      const cursorStyle = document.createElement('style');
      cursorStyle.id = 'typewriter-styles';
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
    }

    setTimeout(type, 500);
  }

  // ==================== TILT EFFECT ON PROJECT CARDS ====================
  function initTiltEffect() {
    const cards = $$('.project-card');
    if (!cards.length) return;

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

  // ==================== INITIALIZE ALL ====================
  function init() {
    initCursor();
    initParticles();
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
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
