import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Float, 
  MeshDistortMaterial,
  Stars,
  Box,
  Sphere,
  Torus,
  Html,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Floating Code Blocks Component
function FloatingCodeBlocks() {
  const groupRef = useRef();
  const codeTexts = [
    'function createApp() {',
    'const data = await fetch();',
    'return <Component />;',
    'export default App;',
    'import { useState } from "react";',
    'const [state, setState] = useState();'
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {codeTexts.map((text, index) => (
        <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text 
            position={[
              Math.cos((index / codeTexts.length) * Math.PI * 2) * 8,
              Math.sin(index * 2) * 3,
              Math.sin((index / codeTexts.length) * Math.PI * 2) * 8
            ]}
            rotation={[0, (index / codeTexts.length) * Math.PI * 2, 0]}
            fontSize={0.8}
            color="#00ff88"
            font="/fonts/JetBrainsMono-Regular.woff"
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </Float>
      ))}
    </group>
  );
}

// Particle System Component
function ParticleSystem() {
  const particlesRef = useRef();
  const particleCount = 200;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.05;
      
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] = Math.sin(time + positions[i3]) * 2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color="#64ffda" 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Interactive Rotating Objects
function RotatingTechObjects() {
  const boxRef = useRef();
  const torusRef = useRef();
  const sphereRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (boxRef.current) {
      boxRef.current.rotation.x = time * 0.5;
      boxRef.current.rotation.y = time * 0.3;
      boxRef.current.position.y = Math.sin(time) * 2;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.2;
      torusRef.current.rotation.z = time * 0.4;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.6;
      sphereRef.current.position.x = Math.cos(time) * 3;
    }
  });

  return (
    <group>
      {/* Rotating Box */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Box ref={boxRef} args={[2, 2, 2]} position={[-8, 3, -5]}>
          <MeshDistortMaterial
            color="#ff6b6b"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.4}
          />
        </Box>
      </Float>

      {/* Rotating Torus */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Torus ref={torusRef} args={[1.5, 0.5, 16, 100]} position={[8, -2, -3]}>
          <MeshDistortMaterial
            color="#4ecdc4"
            attach="material"
            distort={0.4}
            speed={1.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Torus>
      </Float>

      {/* Rotating Sphere */}
      <Float speed={1} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere ref={sphereRef} args={[1.2, 32, 32]} position={[5, 4, 2]}>
          <MeshDistortMaterial
            color="#45b7d1"
            attach="material"
            distort={0.2}
            speed={3}
            metalness={0.6}
            roughness={0.3}
          />
        </Sphere>
      </Float>
    </group>
  );
}

// Main 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
      
      <FloatingCodeBlocks />
      <ParticleSystem />
      <RotatingTechObjects />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Hero Section with 3D Integration
function HeroSection() {
  return (
    <group position={[0, 8, 0]}>
      <Html center transform>
        <div className="hero-content">
          <h1 className="hero-title">
            Advanced Programming Solutions
          </h1>
          <p className="hero-subtitle">
            We create cutting-edge web applications and large-scale management systems
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Our Services</button>
            <button className="btn-secondary">Contact Us</button>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Services Section
function ServicesSection() {
  return (
    <group position={[0, -8, 0]}>
      <Html center transform>
        <div className="services-section">
          <h2 className="section-title">Our Expertise</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🌐</div>
              <h3>Web Development</h3>
              <p>Modern, responsive websites with cutting-edge technologies</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚙️</div>
              <h3>Management Systems</h3>
              <p>Large-scale enterprise solutions for complex business needs</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Full-Stack Solutions</h3>
              <p>End-to-end development from concept to deployment</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// About Section
function AboutSection() {
  return (
    <group position={[15, 0, 0]}>
      <Html center transform>
        <div className="about-section">
          <h2 className="section-title">About Our Company</h2>
          <div className="about-content">
            <p>
              Based in Iran, we are a forward-thinking programming company 
              specializing in innovative web development and comprehensive 
              management systems.
            </p>
            <p>
              Our team combines technical expertise with creative vision to 
              deliver solutions that not only meet but exceed expectations.
            </p>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Contact Section
function ContactSection() {
  return (
    <Html position={[-15, 0, 0]} center>
      <div className="contact-section">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <p>Ready to bring your vision to life?</p>
          <div className="contact-form">
            <input type="text" placeholder="Your Name" className="contact-input" />
            <input type="email" placeholder="Your Email" className="contact-input" />
            <textarea placeholder="Your Message" className="contact-textarea"></textarea>
            <button className="btn-primary">Send Message</button>
          </div>
          <div className="contact-info">
            <p>📧 info@yourcompany.com</p>
            <p>📱 +98 XXX XXX XXXX</p>
            <p>📍 Tehran, Iran</p>
          </div>
        </div>
      </div>
    </Html>
  );
}

// Main App Component
function App() {
  return (
    <div className="App">
      <div className="canvas-container">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 75 }}
          style={{ width: '100vw', height: '100vh' }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene />
            <HeroSection />
            <ServicesSection />
            <AboutSection />
            <ContactSection />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-brand">YourCompany</div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      
      {/* Loading Screen */}
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading 3D Experience...</p>
      </div>
    </div>
  );
}

export default App;