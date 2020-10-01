import React, { useState, useEffect, Fragment } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { signup, isAuthenticated } from './helper/index';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Spinner from '../core/Spinner';

const Signup = ({ history }) => {
  const tokens = [
    { label: 10000, value: 10000 },
    { label: 20000, value: 20000 },
    { label: 30000, value: 30000 },
    { label: 40000, value: 40000 },
    { label: 50000, value: 50000 },
    { label: 60000, value: 60000 },
    { label: 70000, value: 70000 },
    { label: 80000, value: 80000 },
    { label: 90000, value: 90000 },
    { label: 100000, value: 100000 },
  ];

  const [values, setvalues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    wallet_address: '',
    referral_code_used: '',
    token: 'Select....',
    formData: '',
    loading: false,
  });

  useEffect(() => {
    setvalues({
      ...values,
      formData: new FormData(),
      loading: false,
    });
  }, []);

  const {
    email,
    password,
    confirmPassword,
    wallet_address,
    token,
    referral_code_used,
    loading,
    formData,
  } = values;

  const onChange = (e) => {
    if (e.target.name === 'photo_id') {
      formData.append('photo_id', e.target.files[0]);
    } else {
      const value = e.target.value;
      formData.set(e.target.name, value);
      setvalues({ ...values, [e.target.name]: value });
    }
  };

  const onSelectToken = (option) => {
    formData.set('token', option.value);
    setvalues({ ...values, token: option.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setvalues({ ...values, loading: true });
    const res = await signup(formData);

    if (res.data) {
      setvalues({
        email: '',
        password: '',
        confirmPassword: '',
        wallet_address: '',
        token: '',
        referral_code_used: '',
        formData: new FormData(),
        loading: false,
      });
    } else {
      setvalues({
        ...values,
        loading: false,
      });
    }
  };

  if (isAuthenticated()) {
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='text-white text-center mb-1 pb-1'>
            <p className='display-4 font-sm-big'>Sign Up!</p>
            <p className='lead font-sm-head'>Create your account now.</p>
          </div>
          <div className='row mb-4'>
            <div className='col-md-4 col-sm-6 col-8 offset-md-4 offset-sm-3 offset-2 text-left'>
              <form onSubmit={(e) => onSubmit(e)} encType='multipart/form-data'>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-envelope mr-1'></i>
                    {'  '}Email
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='email'
                    value={email}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fas fa-wallet mr-1'></i>
                    {'  '}Wallet Address
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='wallet_address'
                    value={wallet_address}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fas fa-coins mr-1'></i>
                    {'  '}Tokens
                  </label>
                  <Select
                    name='token'
                    onChange={(option) => onSelectToken(option)}
                    options={tokens}
                    defaultValue={{ label: token, value: token }}
                    className='text-dark'
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-phone-alt mr-1'></i>
                    {'  '}Referral Code
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='referral_code_used'
                    placeholder='(Optional)'
                    value={referral_code_used}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-unlock-alt mr-1'></i>
                    {'  '}Password
                  </label>
                  <input
                    className='form-control'
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-unlock-alt mr-1'></i>
                    {'  '}Confirm Password
                  </label>
                  <input
                    className='form-control'
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group text-white'>
                  <label className='text-light'>
                    <i className='fa fa-id-card mr-1'></i>
                    {'  '}Photo ID
                  </label>
                  <input
                    type='file'
                    name='photo_id'
                    className='form-control-file'
                    accept='image/*'
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='text-center mt-3 pt-1'>
                  <button
                    type='submit'
                    className='btn btn-block btn-success rounded mt-3'
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default withRouter(Signup);
