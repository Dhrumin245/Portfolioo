import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/css/style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplashCursor from '../components/animations/Animations/SplashCursor/SplashCursor';
import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          console.error('Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    // Same animations as App.jsx
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }

    if (navLinksItems) {
      navLinksItems.forEach((item) => {
        item.addEventListener('click', () => {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });
    }

    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

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

    // Particle Canvas
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
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
    }
  }, []);

  if (loading) {
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
              <Link to="/" className="logo">Dhrumin<span> Gogari</span></Link>
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
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
        <div className="container section">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  if (!project) {
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
              <Link to="/" className="logo">Dhrumin<span> Gogari</span></Link>
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
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
        <div className="container section">
          <h2>Project Comming Soon...</h2>
        </div>
      </>
    );
  }

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
            <Link to="/" className="logo">Dhrumin<span> Gogari</span></Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
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

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>{project.title}</h2>
          </div>
          <div className="project-detail">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-content">
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <p>Projects coming soon</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <Link to="/" className="logo">PY<span>DEV</span></Link>
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
  );
};

export default ProjectDetails;
