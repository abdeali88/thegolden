import React, { Fragment, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated, signin } from '../auth/helper/index';
import { Redirect, withRouter } from 'react-router';
import Spinner from '../core/Spinner';

const Signin = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false,
  });

  const { email, password, loading } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });
    const res = await signin({ email, password });
    if (res.data) {
      setFormData({
        email: '',
        password: '',
        loading: false,
      });
    } else {
      setFormData({
        ...formData,
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
          {' '}
          <div className='text-white text-center mb-2 pb-2'>
            <h2 className='display-4 font-sm-big'>Log In!</h2>
            {/* <p className='lead font-sm-head'>Login !</p> */}
          </div>
          <div className='row mb-4'>
            <div className='col-md-4 col-sm-6 col-8 offset-md-4 offset-sm-3 offset-2 text-left'>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-envelope'></i>
                    {'  '}Email
                  </label>
                  <input
                    className='form-control'
                    type='text'
                    name='email'
                    value={formData.email}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className='form-group'>
                  <label className='text-light'>
                    <i className='fa fa-unlock-alt'></i>
                    {'  '}Password
                  </label>
                  <input
                    className='form-control'
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className='text-center mt-3 pt-1'>
                  <button
                    type='submit'
                    className='btn btn-block btn-success rounded mt-3'
                  >
                    Sign in
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

export default withRouter(Signin);
