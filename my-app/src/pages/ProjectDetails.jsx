import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplashCursor from '../components/animations/Animations/SplashCursor/SplashCursor';
import { CaseStudyPreview } from '../components/CaseStudyBlocks';
import Footer from '../components/Footer';
import '../assets/css/style.css';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
];

function PageShell({ children }) {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.getElementById('header');

    const handleMenuToggle = () => {
      navLinks?.classList.toggle('active');
      hamburger?.classList.toggle('active');
    };

    const handleScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 80);
    };

    hamburger?.addEventListener('click', handleMenuToggle);
    window.addEventListener('scroll', handleScroll);

    gsap.utils.toArray('.case-block').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 32,
        duration: 0.75,
      });
    });

    return () => {
      hamburger?.removeEventListener('click', handleMenuToggle);
      window.removeEventListener('scroll', handleScroll);
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
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/admin/projects" className="nav-cta">
              Admin
            </Link>
            <div className="hamburger" aria-label="Open navigation" role="button" tabIndex="0">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </nav>
        </div>
      </header>

      {children}

      <Footer />
    </>
  );
}

function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (!res.ok) return;

        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <main className="coming-soon-page">
          <div className="container">
            <div className="coming-soon-panel">
              <h1>Loading case study</h1>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell>
        <main className="coming-soon-page">
          <div className="container">
            <div className="coming-soon-panel">
              <span className="section-kicker">Case Study</span>
              <h1>Project coming soon</h1>
              <p>This case study has not been added to the database yet.</p>
              <Link to="/#work" className="btn btn-secondary">
                Back To Work
              </Link>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main>
        <CaseStudyPreview project={project} />
      </main>
    </PageShell>
  );
}

export default ProjectDetails;
