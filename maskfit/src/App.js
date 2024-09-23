import React, { useState, useEffect } from 'react';

function App() {
  const [idealPressure, setIdealPressure] = useState(50);  // State for user input
  const [sensorValue, setSensorValue] = useState(50);  // Simulated sensor value
  const [color, setColor] = useState('grey');  // Initial color is grey

  // Function to handle input change
  const handleInputChange = (e) => {
    setIdealPressure(e.target.value);
  };

  // Function to compare values and update circle color
  const compareValues = (sensorVal) => {
    const enteredPressure = parseFloat(idealPressure);
    const deviation = Math.abs(sensorVal - enteredPressure);

    // Change color based on deviation
    if (deviation > 20) {
      setColor('red');
    } else if (deviation >= 10 && deviation <= 20) {
      setColor('orange');
    } else {
      setColor('green');
    }
  };

  // Simulate sensor value changing over time
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random sensor value between 40 and 60
      const newSensorValue = Math.floor(Math.random() * 21) + 40;
      setSensorValue(newSensorValue);  // Update sensor value
      compareValues(newSensorValue);  // Compare new sensor value with ideal pressure
    }, 1000);  // Update every 1 second

    return () => clearInterval(interval);  // Cleanup interval on component unmount
  }, [idealPressure]);  // Rerun effect when ideal pressure changes

  return (
    <div className="App">
      <h1>MaskFit - Real-Time Pressure Monitoring</h1>
      <div>
        <label>Enter Ideal Pressure for Patient:</label>
        <input
          type="number"
          value={idealPressure}
          onChange={handleInputChange}
          placeholder="Ideal Pressure"
        />
      </div>

      {/* Circle to indicate pressure status */}
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: color,
          margin: '20px auto',
        }}
      ></div>

      <p>Sensor Value (Real-Time): {sensorValue}</p>
      <p>Ideal Pressure: {idealPressure}</p>
    </div>
  );
}

export default App;
