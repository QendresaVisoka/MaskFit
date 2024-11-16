import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WelcomeScreen from './WelcomeScreen';
import SetPressureScreen from './SetPressure';
import { useDisclosure } from '@nextui-org/react';

function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0); // Step controller for the onboarding flow
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const [pressure, setPressure] = useState(12); // Default pressure
  const [displayedDeviation, setDisplayedDeviation] = useState(12); // State to display deviated pressure in UI
  const [fittingScore, setFittingScore] = useState(50); // Default fitting score
  const markerRefs = useRef([]); // Reference to multiple markers

  // Marker positions
  const markerPositions = [
    [0.02, 1.2, 0.75],  // Front of head marker
    [0.74, 1.2, -0.65], // Head left back marker
    [-0.75, 1.2, -0.65], // Head right back marker
    [0.0, 1.35, -1.24], // Back of the head marker
    [0.0, 0, 1.0] // Air pressure marker
  ];

  // Function to create a blurred texture for the sprite
  function createBlurredTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }

  useEffect(() => {
    if (rendererRef.current || currentStep !== 2) {
      return; // Do not load the 3D model unless we're on the correct step
    }

    const currentMount = mountRef.current;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower pixel ratio for performance
    renderer.setClearColor(new THREE.Color('#030B35'));
    currentMount.appendChild(renderer.domElement);

    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Load the GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/scene2.glb', // Adjust this path if necessary
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);
        model.scale.set(0.1, 0.1, 0.1);
        scene.add(model);
        console.log('Model loaded successfully');
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        alert('Failed to load the model. Please check the file format and path.');
      }
    );

    // Create and add markers to the scene
    markerPositions.forEach((position, index) => {
      const markerMaterial = new THREE.SpriteMaterial({
        map: createBlurredTexture(),
        color: 'green', // Initial color
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const marker = new THREE.Sprite(markerMaterial);
      marker.scale.set(0.5, 0.5, 1.0);
      marker.position.set(...position);
      scene.add(marker);
      markerRefs.current[index] = marker;
    });

    // Set up OrbitControls (rotation only, no zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); // Center the controls on the model
    controls.enableZoom = false; // Disable zoom functionality
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Animation loop with conditional rendering
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    // Initial resize to fit the container
    onWindowResize();

    // Interval to update deviated pressure, marker colors, and fitting score
    const updateMarkers = () => {
      let totalScore = 0;

      markerRefs.current.forEach((marker, index) => {
        const sensorValue = Math.random() * 100; // Random value for each sensor between 0 and 100
        const deviation = Math.abs(sensorValue - 50); // Deviation from ideal value of 50
        totalScore += deviation;

        // Update marker color based on deviation
        const color = getColorForSensorValue(sensorValue);
        marker.material.color.set(color);
      });

      const avgScore = totalScore / markerRefs.current.length;
      setFittingScore(100 - avgScore); // Invert to show higher score as better fit

      // Update deviation for display
      const deviation = (Math.random() - 0.5) * 6; // Random deviation between -3 and 3
      const newDeviatedPressure = Math.min(20, Math.max(6, pressure + deviation));
      setDisplayedDeviation(newDeviatedPressure);

      setTimeout(updateMarkers, 1000); // Call this function again after 1 second
    };
    updateMarkers(); // Start the loop

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [pressure, currentStep]);

  // Function to determine marker color based on sensor value
  function getColorForSensorValue(value) {
    const deviation = Math.abs(value - 50);
    if (deviation < 10) return 'green'; // Low deviation from ideal value
    if (deviation < 20) return 'yellow'; // Moderate deviation
    return 'red'; // High deviation
  }

  // Handler to proceed to the next step
  const handleNextStep = (pressure) => {
    setPressure(pressure); // Ensure pressure value is updated
    setCurrentStep(currentStep + 1); // Move to the next step
  };

  return (
    <div className="App">
      {currentStep === 0 && (
        <WelcomeScreen onNext={() => setCurrentStep(1)} />
      )}

      {currentStep === 1 && (
        <SetPressureScreen onNext={handleNextStep} />
      )}

      {currentStep === 2 && (
        <>
          <h1 className="title">MaskFit</h1>
          <p>Ideal pressure is {pressure} cmH₂O</p>
          <p>Current deviation pressure: {displayedDeviation.toFixed(2)} cmH₂O</p>
          <p>Fitting Score: {fittingScore.toFixed(2)}</p>
          <div ref={mountRef} className="canvas-container" style={{ width: '100%', height: '100vh' }}></div>
        </>
      )}
    </div>
  );
}

export default App;
