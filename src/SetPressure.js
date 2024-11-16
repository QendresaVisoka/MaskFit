import React, { useState } from 'react';
import { Button, Slider } from '@nextui-org/react';
import { motion } from 'framer-motion';

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
    <motion.div
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        style={{ fontSize: '28px', color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Set Your CPAP Pressure
      </motion.h1>
      <motion.p
        style={{ color: '#b0b8d9', marginBottom: '1.5rem', textAlign: 'center', fontSize: '16px' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Please move the slider to set your ideal air pressure value.
      </motion.p>
      <motion.p
        style={{ fontSize: '20px', color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Selected Pressure: {pressure}
      </motion.p>
      <motion.div
        className="flex flex-col gap-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
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
      </motion.div>
      <motion.p
        className="text-default-500 font-medium text-small"
        style={{ color: '#b0b8d9', marginTop: '1rem', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        Consult your healthcare provider to determine your ideal pressure, typically ranging between 6 and 14 cmH₂O.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
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
      </motion.div>
    </motion.div>
  );
};

export default SetPressureScreen;
