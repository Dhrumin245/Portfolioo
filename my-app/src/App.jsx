import { useEffect, useState } from 'react';
import { apiUrl } from './utils/api';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import './assets/css/style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplashCursor from './components/animations/Animations/SplashCursor/SplashCursor';
import ProjectDetails from './pages/ProjectDetails';
// import AdminProjects from './pages/AdminProjects';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

const services = [
  {
    title: 'AI-Built Websites',
    description:
      'High-converting company sites, landing pages, and product pages drafted fast with AI and refined by designers and frontend engineers.',
  },
  {
    title: 'API Engineering',
    description:
      'Secure, documented REST and integration APIs that connect products, CRMs, payment systems, dashboards, and internal workflows.',
  },
  {
    title: 'Web App Development',
    description:
      'Custom SaaS tools, admin panels, portals, dashboards, and workflow apps built around the way your team actually works.',
  },
  {
    title: 'AI Workflow Automation',
    description:
      'AI agents, prompt systems, data flows, and automation layers that reduce repetitive work while staying reviewable and controlled.',
  },
  {
    title: 'Product UI Systems',
    description:
      'Fast, polished interfaces with reusable components, responsive states, and clean handoff for future product growth.',
  },
  {
    title: 'Cloud Launch Support',
    description:
      'Deployment, monitoring, CI/CD, and production checks so your product launches cleanly and keeps running after handoff.',
  },
];

const projects = [
  {
    title: 'Project coming soon',
    slug: 'coming-soon',
    category: 'Upcoming',
    description: 'Project coming soon',
    stack: [],
  },
];

const reasons = [
  {
    title: 'AI speed without AI risk',
    body:
      'AI accelerates drafts, scaffolds, tests, and content. Humans review decisions, architecture, security, and the final user experience.',
  },
  {
    title: 'No black-box delivery',
    body:
      'You see what is being built, why it is being built, and what changed after human review. The process stays visible.',
  },
  {
    title: 'Built for real business use',
    body:
      'We focus on the workflows, conversion paths, APIs, and admin screens that make your company faster after launch.',
  },
  {
    title: 'Fast does not mean fragile',
    body:
      'Every release goes through manual QA, integration checks, responsive review, and production-readiness checks before handoff.',
  },
];

const processSteps = [
  {
    title: 'Discovery',
    description: 'We map your business goal, users, integrations, timeline, and launch constraints.',
    badge: 'Human-led',
  },
  {
    title: 'AI-assisted build',
    description: 'AI helps produce drafts, components, API contracts, content, and test cases at speed.',
    badge: 'AI-accelerated',
  },
  {
    title: 'Human review',
    description: 'Engineers review logic, security, UX, accessibility, performance, and maintainability.',
    badge: 'Human-verified',
  },
  {
    title: 'Launch and improve',
    description: 'We deploy, monitor, fix, document, and help you decide the next valuable iteration.',
    badge: 'Launch-ready',
  },
];

const benefits = [
  { value: '3x', label: 'faster first versions' },
  { value: '100%', label: 'human-reviewed output' },
  { value: '0', label: 'blind AI handoffs' },
  { value: '24h', label: 'response on new briefs' },
];

const isLightTheme = () => document.documentElement.dataset.theme === 'light';
const getParticleColor = (alpha) =>
  isLightTheme() ? `rgba(28, 110, 196, ${alpha})` : `rgba(0, 212, 255, ${alpha})`;
const getParticleLineColor = (alpha) =>
  isLightTheme() ? `rgba(72, 91, 190, ${alpha * 0.72})` : `rgba(0, 212, 255, ${alpha})`;

function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [portfolioProjects, setPortfolioProjects] = useState(projects);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        alert('Project brief sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Failed to send project brief');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Something went wrong!');
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(apiUrl('/api/projects?status=published'));
        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const header = document.getElementById('header');
    const anchors = document.querySelectorAll('a[href^="#"]');

    const handleMenuToggle = () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    };

    const handleMenuClose = () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    };

    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };

    const handleAnchorClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    };

    hamburger.addEventListener('click', handleMenuToggle);
    navLinksItems.forEach((item) => item.addEventListener('click', handleMenuClose));
    window.addEventListener('scroll', handleScroll);
    anchors.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));

    gsap.from('.hero-copy > *', {
      duration: 0.9,
      y: 28,
      opacity: 0,
      stagger: 0.12,
      ease: 'power3.out',
    });

    gsap.from('.hero-console', {
      duration: 1.1,
      x: 70,
      opacity: 0,
      ease: 'power3.out',
    });

    gsap.utils.toArray('.reveal').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 36,
        duration: 0.8,
      });
    });

    gsap.to('.shape-1', {
      duration: 20,
      x: 160,
      y: 120,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-2', {
      duration: 24,
      x: -140,
      y: -170,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-3', {
      duration: 18,
      x: 100,
      y: -90,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const isMobileScreen = window.innerWidth < 768;
    const particleCount = isMobileScreen ? 66 : 90;
    let animationFrameId;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isMobileScreen ? 3.1 : 2.5) + (isMobileScreen ? 1.1 : 1);
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.alpha = Math.random() * (isMobileScreen ? 0.52 : 0.45) + (isMobileScreen ? 0.18 : 0.12);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = getParticleColor(this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 105) {
            ctx.strokeStyle = getParticleLineColor(1 - distance / 105);
            ctx.lineWidth = isMobileScreen ? 0.7 : 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    const handleCanvasResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleCanvasResize);
    initParticles();
    animateParticles();

    return () => {
      hamburger.removeEventListener('click', handleMenuToggle);
      navLinksItems.forEach((item) => item.removeEventListener('click', handleMenuClose));
      window.removeEventListener('scroll', handleScroll);
      anchors.forEach((anchor) => anchor.removeEventListener('click', handleAnchorClick));
      window.removeEventListener('resize', handleCanvasResize);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <SplashCursor />
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <canvas id="particle-canvas"></canvas>

      <header id="header">
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              Dhrumin's <span>Tech world</span>
            </Link>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="nav-actions">
              <a href="#contact" className="nav-cta">
                Start a Project
              </a>
              <ThemeToggle />
            </div>
            <div className="hamburger" aria-label="Open navigation" role="button" tabIndex="0">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-tag">AI-built. Human-approved.</span>
              <h1>
                Software built by AI.
                <span> Perfected by humans.</span>
              </h1>
              <p>
                We design and ship websites, APIs, and web apps at AI speed, then put every
                decision through real engineering review. Fast output. Human accountability.
                No blind automation.
              </p>
              <div className="hero-btns">
                <a href="#contact" className="btn btn-primary">
                  Build With Us
                </a>
                <a href="#work" className="btn btn-secondary">
                  See The Work
                </a>
              </div>
            </div>

            <div className="hero-console">
              <div className="console-header">
                <span>Build Pipeline</span>
                <strong>Live</strong>
              </div>
              <div className="console-line active">
                <span>01</span>
                <p>AI drafts architecture, screens, APIs, and test cases.</p>
              </div>
              <div className="console-line active">
                <span>02</span>
                <p>Senior engineers review logic, security, UX, and edge cases.</p>
              </div>
              <div className="console-line">
                <span>03</span>
                <p>Production build is tested, deployed, documented, and monitored.</p>
              </div>
              <div className="console-note">No generated code ships without human sign-off.</div>
            </div>
          </div>

          <div className="stats-bar">
            {benefits.map((item) => (
              <div className="stat-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section intro-band reveal">
          <div className="container intro-grid">
            <h2>Most teams choose between speed and quality. We built a process for both.</h2>
            <p>
              AI handles the heavy lift: drafts, boilerplate, UI states, API contracts, and
              repetitive code. Humans handle judgment: product clarity, architecture,
              security, performance, QA, and final polish.
            </p>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-title reveal">
              <span className="section-kicker">Core Services</span>
              <h2>Everything a modern company needs to launch online.</h2>
              <p>Built with AI acceleration. Reviewed by humans who know what production means.</p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <article className="service-card reveal" key={service.title}>
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section projects" id="work">
          <div className="container">
            <div className="section-title reveal">
              <span className="section-kicker">Selected Work</span>
              <h2>Websites, APIs, and web apps that feel fast from day one.</h2>
            </div>
            <div className="projects-grid">
              {portfolioProjects.map((project, index) => {
                const stack = project.stack?.length ? project.stack : project.tags ?? [];

                return (
                <Link
                  className={`project-card reveal ${index === 0 ? 'featured-project' : ''}`}
                  key={project.title}
                  to={`/projects/${project.slug}`}
                >
                  <div className="project-visual">
                    <span>{project.category || 'Case Study'}</span>
                    {project.coverImage || project.image ? (
                      <img src={project.coverImage || project.image} alt="" />
                    ) : null}
                    <div className="visual-grid"></div>
                  </div>
                  <div className="project-details">
                    <div className="project-tags">
                      {stack.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section why-section" id="why-us">
          <div className="container why-grid">
            <div className="why-copy reveal">
              <span className="section-kicker">Why Dhrumin's Tech world</span>
              <h2>The smartest way to build is not fully manual or fully automated.</h2>
              <p>
                We combine machine speed with human ownership, so you get momentum without
                accepting risky code, unclear UX, or fragile architecture.
              </p>
              <a href="#contact" className="text-link">
                Talk to the builders
              </a>
            </div>
            <div className="reason-list">
              {reasons.map((reason) => (
                <article className="reason-card reveal" key={reason.title}>
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="process">
          <div className="container">
            <div className="section-title centered reveal">
              <span className="section-kicker">The Pipeline</span>
              <h2>From idea to production without the usual drag.</h2>
              <p>A practical workflow that makes AI useful and keeps humans accountable.</p>
            </div>
            <div className="process-timeline">
              {processSteps.map((step, index) => (
                <article className="timeline-item reveal" key={step.title}>
                  <div className="timeline-dot">{String(index + 1).padStart(2, '0')}</div>
                  <div className="timeline-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <span>{step.badge}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta-section reveal">
          <div className="container">
            <div className="cta-banner">
              <span className="section-kicker">AI precision. Human polish.</span>
              <h2>Bring the idea. We will bring the engine.</h2>
              <p>
                Whether you need a sharper company website, a reliable API, or a full web app,
                Dhrumin's Tech world turns rough requirements into reviewed, launch-ready software.
              </p>
              <a href="#contact" className="btn btn-primary">
                Get A Build Plan
              </a>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy reveal">
              <span className="section-kicker">Start The Build</span>
              <h2>Tell us what you want to launch.</h2>
              <p>
                Send the goal, timeline, and any systems we need to connect. We will respond
                with a practical build path for your website, API, or web app.
              </p>
              <div className="contact-points">
                <span>Websites</span>
                <span>APIs</span>
                <span>Web Apps</span>
                <span>AI Automation</span>
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Business Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Project Brief</label>
                <textarea
                  id="message"
                  className="form-control"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What are you building, and what should it do?"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Send Project Brief
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ProjectComingSoon() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const title = project?.title ?? 'Project';

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const header = document.getElementById('header');

    const handleMenuToggle = () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    };

    const handleMenuClose = () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    };

    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };

    hamburger.addEventListener('click', handleMenuToggle);
    navLinksItems.forEach((item) => item.addEventListener('click', handleMenuClose));
    window.addEventListener('scroll', handleScroll);

    gsap.from('.coming-soon-panel > *', {
      duration: 0.8,
      y: 24,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out',
    });

    gsap.to('.shape-1', {
      duration: 20,
      x: 160,
      y: 120,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-2', {
      duration: 24,
      x: -140,
      y: -170,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-3', {
      duration: 18,
      x: 100,
      y: -90,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 45 : 90;
    let animationFrameId;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.alpha = Math.random() * 0.45 + 0.12;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = getParticleColor(this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 105) {
            ctx.strokeStyle = getParticleLineColor(1 - distance / 105);
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    const handleCanvasResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleCanvasResize);
    initParticles();
    animateParticles();

    return () => {
      hamburger.removeEventListener('click', handleMenuToggle);
      navLinksItems.forEach((item) => item.removeEventListener('click', handleMenuClose));
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleCanvasResize);
      cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(['.shape-1', '.shape-2', '.shape-3', '.coming-soon-panel > *']);
    };
  }, []);

  return (
    <>
      <SplashCursor />
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <canvas id="particle-canvas"></canvas>

      <header id="header">
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              Dhrumin's <span>Tech world</span>
            </Link>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link to={`/${item.href}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="nav-actions">
              <Link to="/#contact" className="nav-cta">
                Start a Project
              </Link>
              <ThemeToggle />
            </div>
            <div className="hamburger" aria-label="Open navigation" role="button" tabIndex="0">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="coming-soon-page">
          <div className="container">
            <div className="coming-soon-panel">
              <span className="section-kicker">{title}</span>
              <h1>Project coming soon</h1>
              <p>This project page is being prepared. The full case study will be added here.</p>
              <Link to="/#work" className="btn btn-secondary">
                Back To Work
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      {/* <Route path="/admin/projects" element={<AdminProjects />} /> */}
    </Routes>
  );
}

export default App;
