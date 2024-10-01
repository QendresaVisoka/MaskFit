import React, { useState, useEffect } from 'react';
import './App.css';  // Optional for styling

function App() {
  const [sensorValue, setSensorValue] = useState(0);
  const [color, setColor] = useState('red');

  useEffect(() => {
    // Simulate sensor value changes
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 100); // Simulating values between 0 and 100
      setSensorValue(newValue);

      // Update circle color based on sensor value
      if (newValue < 30) {
        setColor('red');
      } else if (newValue >= 30 && newValue <= 70) {
        setColor('orange');
      } else {
        setColor('green');
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="App">
      <h1>MaskFit - Mask Fit Monitoring</h1>
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: color,
          margin: '0 auto',
        }}
      ></div>
      <p>Sensor Value: {sensorValue}</p>
    </div>
  );
}

export default App;
