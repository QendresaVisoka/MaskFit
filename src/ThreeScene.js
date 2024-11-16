import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBlurredTexture, getColorForSensorValue } from './utils';

const ThreeScene = ({ pressure, setDisplayedDeviation, setFittingScore }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const markerRefs = useRef([]);
  
  const markerPositions = [
    [0.02, 1.2, 0.75], [0.74, 1.2, -0.65], [-0.75, 1.2, -0.65], [0.0, 1.35, -1.24], [0.0, 0, 1.0]
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(new THREE.Color('#030B35'));
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      '/scene2.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);
        model.scale.set(0.1, 0.1, 0.1);
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    markerPositions.forEach((position, index) => {
      const markerMaterial = new THREE.SpriteMaterial({
        map: createBlurredTexture(),
        color: 'green',
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onWindowResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    const updateMarkers = () => {
      let totalScore = 0;
      markerRefs.current.forEach((marker) => {
        const sensorValue = Math.random() * 100;
        const deviation = Math.abs(sensorValue - 50);
        totalScore += deviation;
        marker.material.color.set(getColorForSensorValue(sensorValue));
      });

      const avgScore = totalScore / markerRefs.current.length;
      setFittingScore(100 - avgScore);
      const deviation = (Math.random() - 0.5) * 6;
      const newDeviatedPressure = Math.min(20, Math.max(6, pressure + deviation));
      setDisplayedDeviation(newDeviatedPressure);
      setTimeout(updateMarkers, 1000);
    };
    updateMarkers();

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
  }, [pressure]);

  return <div ref={mountRef} className="canvas-container" style={{ width: '100%', height: '100vh' }}></div>;
};

export default ThreeScene;
