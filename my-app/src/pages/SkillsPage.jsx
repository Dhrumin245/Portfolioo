import React from 'react';
import { Link } from 'react-router-dom';

const SkillsPage = () => {
  return (
    <div className="container section">
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
          <p>Building robust backend systems with Node,Js and Express.Js</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-database"></i>
          <h3>Database Management</h3>
          <p>Working with SQL and NoSQL databases including PostgreSQL, MySQL, MongoDB, and Redis.</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-chart-line"></i>
          <h3>Data Analysis</h3>
          <p>Using Pandas, NumPy, and Matplotlib for data manipulation, analysis, and visualization.</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-robot"></i>
          <h3>Automation</h3>
          <p>Creating scripts and tools to automate repetitive tasks and improve workflows.</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-cloud"></i>
          <h3>Machine Learning</h3>
          <p>Developing and deploying machine learning models using TensorFlow</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-robot"></i>
          <h3>Deep Learning</h3>
          <p>Develop and training deep neural networks using frameworks like TensorFlow and Keras.</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
};

export default SkillsPage;
