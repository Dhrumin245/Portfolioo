import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSScene = () => {
  const containerRef = useRef(null);
  const shapes = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6e00ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Geometry types
    const geometryTypes = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.ConeGeometry(0.6, 1.2, 32),
      new THREE.TorusGeometry(0.5, 0.2, 16, 32),
      new THREE.OctahedronGeometry(0.8),
    ];

    for (let i = 0; i < 10; i++) {
      const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.3, Math.random() * 0.5 + 0.5),
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        emissive: 0x6e00ff,
        emissiveIntensity: 0.2,
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = Math.random() * 0.5 + 0.5;
      shape.scale.set(scale, scale, scale);

      shape.userData = {
        originalY: shape.position.y,
        speedX: Math.random() * 0.02 - 0.01,
        speedY: Math.random() * 0.02 - 0.01,
        speedZ: Math.random() * 0.02 - 0.01,
        rotSpeedX: Math.random() * 0.01,
        rotSpeedY: Math.random() * 0.01,
      };

      scene.add(shape);
      shapes.current.push(shape);
    }

    camera.position.z = 15;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      shapes.current.forEach((shape) => {
        shape.position.y = shape.userData.originalY + Math.sin(Date.now() * 0.001) * 2;
        shape.rotation.x += shape.userData.rotSpeedX;
        shape.rotation.y += shape.userData.rotSpeedY;
        shape.position.x += shape.userData.speedX;
        shape.position.y += shape.userData.speedY;
        shape.position.z += shape.userData.speedZ;

        if (shape.position.x > 15 || shape.position.x < -15) shape.userData.speedX *= -1;
        if (shape.position.y > 10 || shape.position.y < -10) shape.userData.speedY *= -1;
        if (shape.position.z > 15 || shape.position.z < -15) shape.userData.speedZ *= -1;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="threejs-container" ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -2 }} />;
};

export default ThreeJSScene;
