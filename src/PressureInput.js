import React, { useState } from 'react';

const PressureInput = ({ onSetIdealPressure }) => {
  const [pressure, setPressure] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pressure) {
      onSetIdealPressure(pressure);
      setPressure('');
    }
  };

  return (
    <div className="pressure-input">
      <h2>Enter Ideal Pressure</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          placeholder="Ideal Pressure (in millibar)"
        />
        <button type="submit">Set Pressure</button>
      </form>
    </div>
  );
};

export default PressureInput;
