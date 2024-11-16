import React, { useState } from 'react';
import { Button, Slider } from '@nextui-org/react';

const SetPressureScreen = ({ onNext }) => {
  const [pressure, setPressure] = useState(12); // Default value
 

  const handleNext = () => {
    if (pressure >= 6 && pressure <= 20) {
      onNext(pressure); // Pass the entered pressure to the next screen
    }
  };

  const handleChange = (pressure) => {
    if (isNaN(Number(pressure))) return;

    setPressure(pressure);
    setPressure(pressure.toString());
  };

  return (
    <div
      className="pressure-card-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '15px',
      }}
    >
      <h1 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>
        Set Your CPAP Pressure
      </h1>
      <p style={{ color: '#b0b8d9', marginBottom: '1.5rem', textAlign: 'center', fontSize: '16px' }}>
        Please move the slider to set your ideal air pressure value.
      </p>
      <div className="flex flex-col gap-6 w-full max-w-md">
      <Slider
        aria-label="6-20"
              
        minValue={6}
        maxValue={20}
        defaultValue={12}
        step={1}
        value={pressure}
        onChange={handleChange}
              
        showSteps
        className="max-w-md"
        
      />
      </div>
      <p className="text-default-500 font-medium text-small">Consult your healthcare provider to determine your ideal pressure, typically ranging between 6 and 14 cmH₂O. Selected pressure is {pressure}.</p>

      <Button
        auto
        shadow
        color="primary"
        style={{
          backgroundColor: '#6f4ef2',
          color: 'white',
          padding: '0.75rem 1.5rem',
          width: '100%',
          maxWidth: '200px',
          fontWeight: 'bold',
          marginTop: '1rem',
        }}
        onPress={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default SetPressureScreen;
