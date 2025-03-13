import React, { useState, useEffect } from 'react';

const Cube = () => {
  const [rotation, setRotation] = useState({ x: 5, y: 0, z: 0 });
  const cubeWidth = 13;
  const incrementSpeed = 0.6;
  const canvasWidth = 80;   
  const canvasHeight = 30;
  const distanceFromCam = 100;
  const K1 = 40;
  const horizontalOffset = -1.37 * cubeWidth;
  
  const zBuffer = Array(canvasWidth * canvasHeight).fill(0);
  const buffer = Array(canvasWidth * canvasHeight).fill(' ');

  const calculateX = (i, j, k) => {
    return j * Math.sin(rotation.x) * Math.sin(rotation.y) * Math.cos(rotation.z) - k * Math.cos(rotation.x) * Math.sin(rotation.y) * Math.cos(rotation.z) +
           j * Math.cos(rotation.x) * Math.sin(rotation.z) + k * Math.sin(rotation.x) * Math.sin(rotation.z) + i * Math.cos(rotation.y) * Math.cos(rotation.z);
  };

  const calculateY = (i, j, k) => {
    return j * Math.cos(rotation.x) * Math.cos(rotation.z) + k * Math.sin(rotation.x) * Math.cos(rotation.z) - 
           j * Math.sin(rotation.x) * Math.sin(rotation.y) * Math.sin(rotation.z) + k * Math.cos(rotation.x) * Math.sin(rotation.y) * Math.sin(rotation.z) - 
           i * Math.cos(rotation.y) * Math.sin(rotation.z);
  };

  const calculateZ = (i, j, k) => {
    return k * Math.cos(rotation.x) * Math.cos(rotation.y) - j * Math.sin(rotation.x) * Math.cos(rotation.y) + i * Math.sin(rotation.y);
  };

  const calculateForSurface = (cubeX, cubeY, cubeZ, ch) => {
    const x = calculateX(cubeX, cubeY, cubeZ);
    const y = calculateY(cubeX, cubeY, cubeZ);
    const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

    const ooz = 1 / z;
    const xp = Math.floor((canvasWidth / 2 + horizontalOffset + K1 * ooz * x * 2));
    const yp = Math.floor(canvasHeight / 2 + K1 * ooz * y);

    const idx = xp + yp * canvasWidth;
    if (idx >= 0 && idx < canvasWidth * canvasHeight) {
      if (ooz > zBuffer[idx]) {
        zBuffer[idx] = ooz;
        buffer[idx] = ch;
      }
    }
  };

  const renderCube = () => {
    buffer.fill(' ');
    zBuffer.fill(0);

    let cubeWidthLocal = 13;
    for (let cubeX = -cubeWidthLocal; cubeX < cubeWidthLocal; cubeX += incrementSpeed) {
      for (let cubeY = -cubeWidthLocal; cubeY < cubeWidthLocal; cubeY += incrementSpeed) {
        calculateForSurface(cubeX, cubeY, -cubeWidthLocal, '@');
        calculateForSurface(cubeWidthLocal, cubeY, cubeX, '$');
        calculateForSurface(-cubeWidthLocal, cubeY, -cubeX, '~');
        calculateForSurface(-cubeX, cubeY, cubeWidthLocal, '#');
        calculateForSurface(cubeX, -cubeWidthLocal, -cubeY, ';');
        calculateForSurface(cubeX, cubeWidthLocal, cubeY, '+');
      }
    }

    return buffer.map((ch, idx) => (idx % canvasWidth === 0 ? '\n' : '') + ch).join('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prevRotation => ({
        x: prevRotation.x + 0.05,
        y: prevRotation.y + 0.05,
        z: prevRotation.z + 0.01,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff', // Фиксированный белый фон
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <pre
        style={{
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: '#000000', // Фиксированный черный текст
        }}
      >
        {renderCube()}
      </pre>
    </div>
  );
};

export default Cube;
