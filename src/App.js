import React, { useState } from 'react';
import './App.css';
import PressureInput from './PressureInput';
import SensorDisplay from './SensorDisplay';

function App() {
  const [idealPressure, setIdealPressure] = useState('');

  return (
    <div className="App">
      <h1>NIV FitTrack</h1>
      <PressureInput onSetIdealPressure={setIdealPressure} />
      <SensorDisplay idealPressure={idealPressure} />
    </div>
  );
}

export default App;
