import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Space, Col, Row, Alert, List } from 'antd';
import {
  LeftOutlined,
  WalletFilled,
  MailFilled,
  PaperClipOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import NumericInput from './NumericInput';
import useWindowDimensions from '../hooks/useWindowDimensions';

import {
  SwipeableList,
  SwipeableListItem,
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

import './Host.css';
import Loader from './Loader';

const Host = () => {
  const { width } = useWindowDimensions();
  const [result, setResult] = useState('');
  const [people, setPeople] = useState({});
  const [billAmount, setBillAmount] = useState('');
  const [totalBill, setTotalBill] = useState(0.0);
  const [wallet, setWallet] = useState('');
  const [[page, direction], setPage] = useState([0, 0]);
  const [currAmount, setCurrAmount] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(0);

  const [refresh, setRefresh] = useState(false);

  const [loading, setLoading] = useState(true);

  const ref = useRef(null);

  const onChange = (e, index) => {
    if (index === 0) {
      if (e.length !== 0) {
        if (error === 3) {
          message.error('Please enter a wallet address.');
          setError(2);
        } else if (error === 1) {
          setError(0);
        }
      }
      setBillAmount(e);
    } else if (index === 1) {
      if (e.target.value.length !== 0) {
        if (error === 3) {
          message.error('Please enter a bill amount.');
          setError(1);
        } else if (error === 2) {
          setError(0);
        }
      }
      setWallet(e.target.value);
    } else if (index === 2) {
      if (e.target.value.length !== 0) {
        if (error === 6) {
          setError(5);
          message.error('Please enter the amount owed.');
        } else if (error === 4) {
          setError(0);
        }
      }
      setEmail(e.target.value);
    } else if (index === 3) {
      if (e.length !== 0) {
        if (error === 6) {
          message.error("Please enter the person's email address");
          setError(4);
        } else if (error === 5) {
          setError(0);
        }
      }
      setCurrAmount(e);
    }
  };

  const sendData = () => {
    // json sent the address
    let payload = {};
    payload['bill_amount'] = billAmount;
    payload['wallet_address'] = wallet;
    payload['people'] = { ...people };
    // axios request here
    axios.post('http://localhost:9000/makepool', payload)
    setTimeout(() => {
      setLoading(false);
      let fakeResults = {};
      for (var person in people) {
        var result = '';
        var characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 34; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        fakeResults[person] = result;
      }
      setResult(fakeResults);
    }, 2500);
  };

  const paginate = (newDirection) => {
    if (page + newDirection === 1) {
      // check to make sure both fields are filled
      if (billAmount === '' && wallet === '') {
        message.error('Please fill out both fields.');
        setError(3);
        return;
      } else if (billAmount === '') {
        message.error('Please enter a bill amount.');
        setError(1);
        return;
      } else if (wallet === '') {
        message.error('Please enter a wallet address.');
        setError(2);
        return;
      }
    } else if (page + newDirection === 2) {
      // check to make sure the amount of people is not zero
      if (Object.keys(people).length === 0 && people.constructor === Object) {
        message.error('Please add at least one person.');
        setError(6);
        return;
      } else if (totalBill > parseFloat(billAmount)) {
        message.error(
          `Amount added ($${totalBill}) exceeds bill amount ($${billAmount})!\nDelete some people (swipe right).`
        );
        setError(0);
        return;
      }

      sendData();
    }
    setError(0);
    setPage([page + newDirection, newDirection]);
  };

  const copyToClipboard = (person) => {
    let str = result[person];
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    message.info(`Copied ${person}'s key!`);
  };

  const copyAllToClipboard = (result) => {
    if (Object.keys(result).length === 0) {
      return;
    }
    let str = '';
    for (var key in result) {
      str += `${key}, $${people[key]} - ${result[key]}\n`;
    }
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    message.info('Copied all keys!');
  };

  const addPerson = (e) => {
    let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (currAmount === '' && email === '') {
      message.error('Please fill out both fields.');
      setError(6);
    } else if (currAmount === '') {
      message.error('Please enter the amount owed.');
      setError(5);
    } else if (email === '') {
      message.error('Please enter a valid e-mail.');
      setError(4);
    } else if (email in people) {
      message.error('Duplicate e-mail detected.');
      setError(7);
    } else if (!reg.test(email)) {
      message.error('Please enter a valid e-mail.');
      setError(4);
    } else {
      let currBill = parseFloat(totalBill) + parseFloat(currAmount);

      if (currBill > billAmount) {
        message.warning("You've exceeded your bill amount!");
        setError(8);
      } else {
        // no error, so we add to the list
        setError(0);
      }

      let newPeople = people;
      newPeople[email] = currAmount;
      setPeople(newPeople);

      setTotalBill(currBill);
      setEmail('');
      setCurrAmount('');
    }
  };

  const removePerson = (person) => {
    let newPeople = { ...people };
    let currBill = parseFloat(totalBill) - parseFloat(newPeople[person]);
    if (currBill < billAmount) {
      setError(0);
    }
    delete newPeople[person];
    setPeople(newPeople);
    setTotalBill(currBill);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring' }}>
      <div className={'back-button'}>
        {page === -1 && <Redirect to='/' />}
        {page > -1 && (
          <Button
            style={{ color: 'rgb(62, 247, 62)', marginBottom: '3%' }}
            onClick={() => paginate(-1)}
            icon={<LeftOutlined style={{ fontSize: '2em' }} />}
            type='text'
            shape='round'
          />
        )}
      </div>
      <div className={'content-container'}>
        <AnimatePresence initial={false} exitBeforeEnter>
          {page === 0 && (
            <motion.div
              key='page-0'
              initial={{ x: width, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -width, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}>
              <header className={'header'}>Create a Bill</header>
              <Space direction='vertical'>
                <motion.div
                  animate={{
                    scale: error === 1 || error === 3 ? [1.05, 1] : 1,
                  }}
                  transition={{
                    repeat: error === 1 || error === 3 ? Infinity : 0,
                    repeatType: 'mirror',
                  }}
                  className={'input'}>
                  <NumericInput
                    className={'round-border'}
                    onChange={onChange}
                    index={0}
                    prefix={'$'}
                    placeholder={'Bill Amount'}
                    value={billAmount}
                  />
                </motion.div>
                <motion.div
                  animate={{
                    scale: error === 2 || error === 3 ? [1.05, 1] : 1,
                  }}
                  transition={{
                    repeat: error === 2 || error === 3 ? Infinity : 0,
                    repeatType: 'mirror',
                  }}
                  className={'input'}>
                  <Input
                    className={'round-border'}
                    maxLength={64}
                    onChange={(e) => onChange(e, 1)}
                    prefix={<WalletFilled />}
                    size='large'
                    placeholder={'Wallet Address'}
                    value={wallet}
                  />
                </motion.div>
                <Button
                  onClick={() => paginate(1)}
                  type='primary'
                  shape='round'
                  size='large'>
                  Next
                </Button>
              </Space>
            </motion.div>
          )}

          {page === 1 && (
            <motion.div
              key='page-1'
              initial={{ x: width, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -width, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}>
              <header className={'header'}>
                Who owes you?
                <header className={'sub-header'}>
                  (Swipe right to delete)
                </header>
                <header className={`sub-header ${error === 8 ? 'red' : ''}`}>
                  Pool: ${totalBill}
                </header>
                <header className={'sub-header'}>Bill: ${billAmount}</header>
              </header>
              <Space direction='vertical'>
                <motion.div
                  animate={{
                    scale: error === 6 ? [1.05, 1] : 1,
                  }}
                  transition={{
                    repeat: error === 6 ? Infinity : 0,
                    repeatType: 'mirror',
                  }}
                  className={'input-full'}>
                  <Input.Group size='large'>
                    <Row gutter={0}>
                      <Col span={16}>
                        <motion.div
                          animate={{
                            scale: error === 4 ? [1.05, 1] : 1,
                          }}
                          transition={{
                            repeat: error === 4 ? Infinity : 0,
                            repeatType: 'mirror',
                          }}>
                          <Input
                            className={'left-round-border'}
                            prefix={<MailFilled />}
                            value={email}
                            size='large'
                            onChange={(e) => onChange(e, 2)}
                            placeholder={'E-mail'}
                          />
                        </motion.div>
                      </Col>
                      <Col span={8}>
                        <motion.div
                          animate={{
                            scale: error === 5 ? [1.05, 1] : 1,
                          }}
                          transition={{
                            repeat: error === 5 ? Infinity : 0,
                            repeatType: 'mirror',
                          }}>
                          <NumericInput
                            className={'right-round-border'}
                            onChange={(e) => onChange(e, 3)}
                            prefix={'$'}
                            placeholder={'owed'}
                            value={currAmount}
                          />
                        </motion.div>
                      </Col>
                    </Row>
                  </Input.Group>
                </motion.div>
                <div className={'button-group'}>
                  <Button
                    onClick={addPerson}
                    type='primary'
                    shape='round'
                    size='large'>
                    Add
                  </Button>

                  <Button
                    onClick={() => paginate(1)}
                    type='primary'
                    shape='round'
                    size='large'>
                    Finish
                  </Button>
                </div>
                <AnimatePresence initial={false}>
                  {Object.keys(people).length !== 0 && (
                    <motion.div
                      className={'list-container'}
                      initial={{ x: width, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -width, opacity: 0 }}
                      transition={{ type: 'spring', duration: 1.5 }}>
                      <SwipeableList threshold={0.18}>
                        <AnimatePresence initial={false}>
                          {Object.keys(people).map((person, i) => (
                            <motion.div
                              key={i}
                              className={'list-item'}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: 'spring', duration: 0.2 }}>
                              <SwipeableListItem
                                swipeLeft={{
                                  content: (
                                    <div className={'delete'}>Delete</div>
                                  ),
                                  action: () => removePerson(person),
                                }}>
                                <div className={'list-item'}>
                                  <div>{person} </div>
                                  <div>${people[person]}</div>
                                </div>
                              </SwipeableListItem>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </SwipeableList>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Space>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div
              key='page-2'
              initial={{ x: width, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -width, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}>
              <header className={'header'}>
                Pass it on!
                <header className={'sub-header'}>(Click to copy)</header>
              </header>
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', duration: 1.5 }}>
                    <Loader />
                  </motion.div>
                )}
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', duration: 1.5 }}>
                    <Space direction='vertical'>
                      <div className={'list-container'}>
                        {Object.keys(result).map((person) => (
                          <div
                            className={'list-item'}
                            onClick={() => copyToClipboard(person)}>
                            <div> {person} </div>

                            <div>${people[person]}</div>
                            <div style={{ width: '100%' }}>
                              &gt; {result[person]}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={'button-group'}>
                        <Button
                          onClick={() => copyAllToClipboard(result)}
                          type='primary'
                          shape='round'
                          icon={<PaperClipOutlined />}
                          size='large'>
                          Copy All
                        </Button>
                        {console.log(refresh)}
                        <Button
                          onClick={() => setPage([-1, 0])}
                          type='primary'
                          shape='round'
                          size='large'>
                          Start Over
                        </Button>
                      </div>
                    </Space>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Host;
