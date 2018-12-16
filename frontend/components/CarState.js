import { useState, useEffect } from 'react';
import styled from 'styled-components';
import socket from '../socket';
// import Battery from './Battery';
// import Tilt from './Tilt';
import Rpm from './Rpm';

function useCarState() {
  const [carState, updatecarState] = useState({});
  useEffect(() => {
    socket.on('carstate', updatecarState);
    return () => socket.removeListener('carstate');
  }, []);
  return carState;
}

function useSocket() {
  const [status, updateStatus] = useState('DISCONNECTED');
  useEffect(() => {
    socket.on('status', updateStatus);
    return () => socket.removeListener('status');
  }, []);
  return status;
}

const CarStateStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 5px;
  .status {
    grid-column: 1 / -1;
    text-align: center;
  }
  .kmh {
    font-size: 4rem;
  }
  .gear {
    font-size: 3rem;
  }
`;

const CarState = () => {
  const status = useSocket();
  const carState = useCarState([]);
  return (
    <CarStateStyles>
      <p className="status">Status: {status}</p>
      <p className="status kmh">{carState.kmh} km/h</p>
      <p className="status gear">{carState.gear}</p>
      <p className="status">{carState.delta} ms</p>
      {carState.rpm && <Rpm max={carState.rpm.max} min={carState.rpm.min} actual={carState.rpm.actual}/>}
    </CarStateStyles>
  );
};

export default CarState;