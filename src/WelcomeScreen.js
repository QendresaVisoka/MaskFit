import React from 'react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import placeholderImage from './img/welcome_image.PNG';

const WelcomeScreen = ({ onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="welcome-card-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <img
        src={placeholderImage}
        alt="Placeholder"
        style={{ width: '100%', borderRadius: '16px', marginBottom: '1rem' }}
      />
      <h1
        style={{
          fontSize: '24px',
          color: '#ffffff',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Welcome to MaskFit
      </h1>
      <p style={{ color: '#a8b0d3', marginBottom: '1.5rem' }}>
        We're here to help you achieve the perfect mask fit. Let's get started by setting up your ideal settings.
      </p>
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
        onPress={onNext}
      >
        Get Started
      </Button>
    </motion.div>
  );
};

export default WelcomeScreen;
