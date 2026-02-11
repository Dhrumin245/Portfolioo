import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectDetails from './pages/ProjectDetails';
import SkillsPage from './pages/SkillsPage';
import aboutMeImage from './assets/Dhrumin_photo.jpg';
import './assets/css/style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplashCursor from './components/animations/Animations/SplashCursor/SplashCursor';
import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);

function App() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      alert('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      alert('Failed to send message');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Something went wrong!');
  }
};

  const handleDownloadResume = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const blob = await res.blob();
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'resume.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download resume');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Something went wrong!');
    }
  };

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    navLinksItems.forEach((item) => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      });
    });

    // Debug: Check if GSAP is loaded
    console.log('GSAP:', typeof gsap !== 'undefined' ? 'Loaded' : 'Not loaded');

    // Debug: Check if elements exist
    const heroH1 = document.querySelector('.hero-content h1');
    const heroP = document.querySelector('.hero-content p');
    const heroBtns = document.querySelector('.hero-btns');
    const heroImage = document.querySelector('.hero-image');
    console.log('hero-content h1:', heroH1);
    console.log('hero-content p:', heroP);
    console.log('hero-btns:', heroBtns);
    console.log('hero-image:', heroImage);

    // Debug: Animate only if elements exist
    if (heroH1) {
      gsap.from(heroH1, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        onStart: () => console.log('Animating hero h1'),
      });
    } else {
      console.warn('hero-content h1 not found');
    }

    if (heroP) {
      gsap.from(heroP, {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out',
        onStart: () => console.log('Animating hero p'),
      });
    } else {
      console.warn('hero-content p not found');
    }

    if (heroBtns) {
      gsap.from(heroBtns, {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.6,
        ease: 'power3.out',
        onStart: () => console.log('Animating hero btns'),
      });
    } else {
      console.warn('hero-btns not found');
    }

    if (heroImage) {
      gsap.from(heroImage, {
        duration: 1.5,
        x: 100,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out',
        onStart: () => console.log('Animating hero image'),
      });
    } else {
      console.warn('hero-image not found');
    }

    gsap.to('.shape-1', {
      duration: 20,
      x: 200,
      y: 150,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-2', {
      duration: 25,
      x: -150,
      y: -200,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.shape-3', {
      duration: 18,
      x: 100,
      y: -100,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.utils.toArray('.section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 1,
      });
    });

    gsap.utils.toArray('.skill-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        delay: i * 0.1,
      });
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        delay: i * 0.1,
      });
    });

    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
    });

    document.querySelectorAll('.skill-card, .project-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          duration: 0.3,
          scale: 1.02,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.3,
          scale: 1,
          ease: 'power2.out',
        });
      });
    });

    // Particle Canvas
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 56 + 200)}, ${Math.floor(
          Math.random() * 56
        )}, 255, ${Math.random() * 0.5 + 0.1})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.fillStyle = this.color;
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
          if (distance < 100) {
            ctx.strokeStyle = `rgba(110, 0, 255, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    initParticles();
    animateParticles();

    // Three.js Rotating Wireframe Ball
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        // Increase canvas size to 1.5 times heroImage container size for bigger ball
        heroCanvas.width = 400;
        heroImage.clientWidth * 1.2; 
        heroCanvas.height = 400;
        heroImage.clientHeight * 2.5;
        heroCanvas.style.position = 'absolute';
        heroCanvas.style.top = '-20';
        heroCanvas.style.left = '-20%';
      }

      // Scene
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        heroCanvas.width/ heroCanvas.height,
        0.1,
        100
      );
      camera.position.z = 13; // Adjust camera position to fit ball inside canvas

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(heroCanvas.width, heroCanvas.height);
      renderer.setClearColor(0x000000, 0);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0x7b2dff, 1);
      directionalLight2.position.set(-1, -1, -1);
      scene.add(directionalLight2);

      // Geometry (wireframe icosahedron)
      const geometry = new THREE.IcosahedronGeometry(7, 4); // Larger geometry for bigger ball

      // Material
      const material = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.2,
        specular: 0x7b2dff,
        shininess: 30,
        transparent: true,
        opacity: 0.9,
        wireframe: true
      });

      // Mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 0;
      mesh.position.y = 0;
      scene.add(mesh);

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      // Handle resize
      const handleResize = () => {
        if (heroImage) {
          heroCanvas.width = heroImage.clientWidth;
          heroCanvas.height = heroImage.clientHeight;
          heroCanvas.style.left = '-25%';
        }
        camera.aspect = heroCanvas.width / heroCanvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(heroCanvas.width, heroCanvas.height);
      };

      window.addEventListener('resize', handleResize);

      animate();
    }
  }, []);

  return (
    <>
      <SplashCursor />
      {/* Background */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <canvas id="particle-canvas"></canvas>
      <Routes>
        <Route
          path="/"
          element={
            <>

              <header id="header">
                <div className="container">
                  <nav>
                    <a href="#" className="logo">Dhrumin<span> Gogari</span></a>
                    <ul className="nav-links">
                      <li><a href="#about">About</a></li>
                      <li><a href="#skills">Skills</a></li>
                      <li><a href="#projects">Projects</a></li>
                      <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="hamburger">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </nav>
                </div>
              </header>

              {/* Hero Section */}
              <section className="hero">
                <div className="container">
                  <div className="hero-content">
                    <h1>Decoding Patterns Delivering Impact</h1>
                    <p>I’m a Data Scientist skilled in uncovering insights, building predictive models, and driving smarter strategies with clean, meaningful data.</p>
                    <div className="hero-btns">
                      <a href="#projects" className="btn btn-primary">View My Work</a>
                      <a href="#contact" className="btn btn-secondary">Hire Me</a>
                    </div>
                  </div>
                  <div className="hero-image">
                    <canvas id="hero-canvas"></canvas>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="section" id="about">
                <div className="container">
                  <div className="section-title">
                    <h2>About Me</h2>
                  </div>
                  <div className="about-content">
                    <div className="about-image">
                      <img
                        src={aboutMeImage}
                        alt="Developer"
                      />
                    </div>
                    <div className="about-text">
                      <h3>Turning Data into Decisions</h3>
                      <p>
                        I'm a Data Scientist driven by curiosity and a deep interest in uncovering patterns that lead to smarter outcomes. I enjoy working with data—cleaning it, analyzing it, and building models that help solve real-world problems.
                      </p>
                      <p>
                        With hands-on experience in data analysis, visualization, and machine learning, I focus on delivering insights that are not only accurate but also meaningful. I believe in writing clean, reproducible code and using data storytelling to make complex information understandable
                      </p>
                      <p>
                        Whether it's exploring trends, building predictive models, or automating reports, I approach every project with a focus on learning, impact, and continuous improvement.
                      </p>
                      <button onClick={handleDownloadResume} className="btn btn-primary">Download Resume</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills Section */}
              <section className="section" id="skills">
                <div className="container">
                  <div className="section-title">
                    <h2>My Skills</h2>
                  </div>
                  <div className="skills-container">
                    <div className="skill-card">
                      <i className="fab fa-python"></i>
                      <h3>Python Development</h3>
                      <p>Expertise in Python programming, including advanced concepts like decorators, generators, and context managers.</p>
                    </div>
                    <div className="skill-card">
                      <i className="fas fa-server"></i>
                      <h3>Backend Development</h3>
                      <p>Building robust backend systems with Django, Flask, and FastAPI for web applications and APIs.</p>
                    </div>
                    <div className="skill-card">
                      <i className="fas fa-database"></i>
                      <h3>Database Management</h3>
                      <p>Working with SQL and NoSQL databases including PostgreSQL, MySQL, MongoDB, and Redis.</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/skills" className="btn btn-primary">View More Skills</Link>
                  </div>
                </div>
              </section>

              {/* Projects Section */}
              <section className="section projects" id="projects">
                <div className="container">
                  <div className="section-title">
                    <h2>Featured Projects</h2>
                  </div>
                  <div className="projects-container">
                    <div className="project-card">
                      <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="E-commerce API" />
                      </div>
                      <div className="project-content">
                        <h3>E-commerce API</h3>
                        <p>Built a scalable e-commerce backend API with Django REST Framework, handling thousands of requests per second.</p>
                        <div className="project-tags">
                          <span className="tag">Python</span>
                          <span className="tag">Django</span>
                          <span className="tag">REST API</span>
                        </div>
                        <Link to="/project/ecommerce-api" className="view-project">View Project →</Link>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Data Pipeline" />
                      </div>
                      <div className="project-content">
                        <h3>Data Processing Pipeline</h3>
                        <p>Developed a high-performance data pipeline for processing and analyzing large datasets with Python and Apache Spark.</p>
                        <div className="project-tags">
                          <span className="tag">Python</span>
                          <span className="tag">Spark</span>
                          <span className="tag">Pandas</span>
                        </div>
                        <Link to="/project/data-pipeline" className="view-project">View Project →</Link>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-image">
                        <img src="src/assets/Dhrumin_photo" alt="Automation Tool" />
                      </div>
                      <div className="project-content">
                        <h3>Workflow Automation</h3>
                        <p>Created an automation tool that reduced manual work by 80% by automating repetitive tasks across multiple systems.</p>
                        <div className="project-tags">
                          <span className="tag">Python</span>
                          <span className="tag">Automation</span>
                          <span className="tag">Selenium</span>
                        </div>
                        <Link to="/project/workflow-automation" className="view-project">View Project →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="section" id="contact">
                <div className="container">
                  <div className="section-title">
                    <h2>Get In Touch</h2>
                  </div>
                  <form className="contact-form" onSubmit={handleSubmit}>
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
                      <label htmlFor="email">Email</label>
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
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        className="form-control"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                  </form>
                </div>
              </section>

              {/* Footer */}
              <footer>
                <div className="container">
                  <div className="footer-content">
                    <a href="#" className="logo">PY<span>DEV</span></a>
                    <p>Building the future, one line of code at a time.</p>
                    <div className="social-links">
                      <a href="https://github.com/Dhrumin245" className="social-link"><i className="fab fa-github"></i></a>
                      <a href="https://www.linkedin.com/in/dhrumin-gogari-74b52025a/" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                      <a href="https://www.instagram.com/dhrumin_2684?igsh=ejJ0NTMwbWM1dmY4" className="social-link"><i className="fab fa-instagram"></i></a>
                      <a href="#" className="social-link"><i className="fab fa-stack-overflow"></i></a>
                    </div>
                  </div>
                  <p className="copyright">© 2025 Data Scientist. All rights reserved.</p>
                </div>
              </footer>
            </>
          }
        />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
    </>
  );
}

export default App;
