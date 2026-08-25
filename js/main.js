(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    if (loader) {
      window.setTimeout(() => loader.classList.add("is-hidden"), 350);
    }
  });

  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 14);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const syncActiveLink = () => {
    const scrollPoint = window.scrollY + 140;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPoint) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  syncActiveLink();
  window.addEventListener("scroll", syncActiveLink, { passive: true });

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );

      revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
        revealObserver.observe(item);
      });
    }
  }

  const typewriter = document.getElementById("typewriter");
  const words = ["raspados", "cocteleria", "cafeterias", "aguas frescas", "emprendedores"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tickTypewriter = () => {
    if (!typewriter || prefersReducedMotion) {
      if (typewriter) typewriter.textContent = words[0];
      return;
    }

    const currentWord = words[wordIndex];
    typewriter.textContent = currentWord.slice(0, charIndex);

    if (!deleting && charIndex < currentWord.length) {
      charIndex += 1;
      window.setTimeout(tickTypewriter, 78);
      return;
    }

    if (!deleting && charIndex === currentWord.length) {
      deleting = true;
      window.setTimeout(tickTypewriter, 1150);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(tickTypewriter, 42);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(tickTypewriter, 180);
  };

  tickTypewriter();

  const canvas = document.getElementById("particles-canvas");
  const context = canvas?.getContext("2d");

  if (canvas && context && !prefersReducedMotion) {
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = 0;

    const colors = ["#ffcf4f", "#ff6f3c", "#b31f5a", "#79bd45", "#fff7df"];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(72, Math.max(34, Math.floor(width / 22)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.4 + .8,
        vx: (Math.random() - .5) * .28,
        vy: Math.random() * .34 + .08,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * .38 + .18
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y > height + 10) particle.y = -10;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = particle.alpha;
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationId));
  }
})();
