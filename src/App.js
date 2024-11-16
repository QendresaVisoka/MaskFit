import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from './WelcomeScreen';
import SetPressureScreen from './SetPressure';
import ThreeScene from './ThreeScene';


function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [pressure, setPressure] = useState(12);
  const [displayedDeviation, setDisplayedDeviation] = useState(12);
  const [fittingScore, setFittingScore] = useState(50);

  const handleNextStep = (pressure) => {
    setPressure(pressure);
    setCurrentStep(currentStep + 1);
  };



  return (
    <div className="App">
      {currentStep === 0 && (
        <WelcomeScreen onNext={() => setCurrentStep(1)} />
      )}

      {currentStep === 1 && (
        <SetPressureScreen onNext={handleNextStep} />
      )}

      {currentStep === 2 && (
        <>
          <h1 className="title">MaskFit</h1>
          <p>Ideal pressure is {pressure} cmH₂O</p>
          <p>Current deviation pressure: {displayedDeviation.toFixed(2)} cmH₂O</p>
          <p>Fitting Score: {fittingScore.toFixed(2)}</p>
          <ThreeScene
            pressure={pressure}
            setDisplayedDeviation={setDisplayedDeviation}
            setFittingScore={setFittingScore}
          />
        </>
      )}
    </div>
  );
}

export default App;
