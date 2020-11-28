import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import './Home.css';
import { AnimatePresence, motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring' }}
      className={'home-container'}>
      <header className={'main-header'}>CryptoLunch</header>
      <header style={{ marginBottom: '30px' }} className={'sub-header'}>
        Decentralized application that splits your bill anonymously!
      </header>
      <Link to='/host'>
        <Button size='large' shape='round' type='primary'>
          Create a Bill!
        </Button>
      </Link>
    </motion.div>
  );
};

export default Home;
