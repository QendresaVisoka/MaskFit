import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen(); // Opens the modal when the app loads
  }, []);

  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const [enteredPressure, setEnteredPressure] = useState(75); // Default entered pressure
  const [displayedDeviation, setDisplayedDeviation] = useState(75); // State to display deviated pressure in UI
  const markerRef = useRef(null);

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
    if (rendererRef.current) {
      return;
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

    // Add the red/yellow/green circle marker
    const markerMaterial = new THREE.SpriteMaterial({
      map: createBlurredTexture(),
      color: 'green', // Initial color
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const marker = new THREE.Sprite(markerMaterial);
    marker.scale.set(0.5, 0.5, 1.0);
    marker.position.set(0.02, 1.2, 0.75);
    scene.add(marker);
    markerRef.current = marker;

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

    // Interval to update deviated pressure and marker color
    const updateMarker = () => {
      const deviation = (Math.random() - 0.5) * 100; // Random deviation between -50 and 50
      const newDeviatedPressure = Math.min(100, Math.max(50, enteredPressure + deviation));
      setDisplayedDeviation(newDeviatedPressure);

      setTimeout(updateMarker, 1000); // Call this function again after 1 second
    };
    updateMarker(); // Start the loop

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
  }, [enteredPressure]);

  // Effect to update the color of the marker when `displayedDeviation` changes
  useEffect(() => {
    if (markerRef.current) {
      const color = getColorForDeviation(displayedDeviation, enteredPressure);
      markerRef.current.material.color.set(color);
    }
  }, [displayedDeviation]);

  // Function to determine color based on deviation
  function getColorForDeviation(value, entered) {
    const deviation = Math.abs(value - entered);
    if (deviation < 10) return 'green'; // Low deviation
    if (deviation < 20) return 'yellow'; // Moderate deviation
    return 'red'; // High deviation
  }

  // Handler for modal input submission
  const handleModalSubmit = () => {
    setEnteredPressure(parseFloat(enteredPressure)); // Ensure entered pressure is updated
    onOpenChange(false); // Close the modal using NextUI's disclosure state
  };

  return (
    <div className="App">
      <h1 className="title">MaskFit</h1>
      <div ref={mountRef} className="canvas-container" style={{ width: '100%', height: '100vh' }}></div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Enter Ideal Pressure</ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  defaultValue="50"
                  description="Ideal pressure value should be between 50 and 100 cmH2O"
                  value={enteredPressure}
                  onChange={(e) => setEnteredPressure(parseFloat(e.target.value))}
                  step="1"
                  min="50"
                  max="100"
                />
              </ModalBody>
              <ModalFooter>
                <Button auto flat color="error" onPress={onClose}>
                  Close
                </Button>
                <Button auto onPress={handleModalSubmit}>
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}

export default App;
