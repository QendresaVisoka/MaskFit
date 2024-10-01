import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure CSS is imported

function App() {
  const [idealPressure, setIdealPressure] = useState(50);
  const [sensors, setSensors] = useState([
    { id: 1, value: 50, color: 'grey', className: 'dot-1' },
    { id: 2, value: 50, color: 'grey', className: 'dot-2' },
    { id: 3, value: 50, color: 'grey', className: 'dot-3' },
    { id: 4, value: 50, color: 'grey', className: 'dot-4' },
    { id: 5, value: 50, color: 'grey', className: 'dot-5' },
    { id: 6, value: 50, color: 'grey', className: 'dot-6' }
  ]);

  const handleInputChange = (e) => {
    setIdealPressure(e.target.value);
  };

  const compareValues = (sensorVal, idealPressure) => {
    const deviation = Math.abs(sensorVal - idealPressure);

    if (deviation > 20) {
      return 'red';
    } else if (deviation >= 10 && deviation <= 20) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const newSensorValue = Math.floor(Math.random() * 21) + 40;
          const newColor = compareValues(newSensorValue, parseFloat(idealPressure));
          return { ...sensor, value: newSensorValue, color: newColor };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [idealPressure]);

  return (
    <div className="App">
      <h1 className="title">MaskFit - Real-Time Pressure Monitoring</h1>

      <div className="form">
        <label>Enter Ideal Pressure for Patient:</label>
        <input
          type="number"
          value={idealPressure}
          onChange={handleInputChange}
          placeholder="Ideal Pressure"
        />
      </div>

      <div className="sensor-dots">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`sensor-dot ${sensor.className}`}
            style={{ backgroundColor: sensor.color }}
          ></div>
        ))}
      </div>

      <div className="status-icon">
        <div>
          X
        </div>
        <p>Too tight</p>
        <p>Please adjust your straps for a looser fit</p>
      </div>
    </div>
  );
}

export default App;
