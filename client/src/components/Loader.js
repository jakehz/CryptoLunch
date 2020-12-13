import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className='loader'>
      <img
        className='loader__animated'
        src='https://image.flaticon.com/icons/svg/561/561071.svg'
        alt='Loading'
      />
      <img
        src='https://image.flaticon.com/icons/svg/560/560969.svg'
        alt='Loading'
      />
    </div>
  );
};

export default Loader;
