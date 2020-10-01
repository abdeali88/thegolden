import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { isAuthenticated, signout } from '../auth/helper';
import { getUser } from '../user/helper';
import Spinner from '../core/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getUnverifiedUsers, verifyUser } from './helper';
import { verify } from 'crypto';

const Verification = ({ history }) => {
  const { user, token } = isAuthenticated();
  const [loading, setLoading] = useState(true);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    getUser(user, token)
      .then((res) => {
        if (res.data && res.data.role === 1) {
          getUnverifiedUsers(user, token).then((res) => {
            if (res.data) {
              setUnverifiedUsers(res.data);
              setLoading(false);
            } else {
              signout();
              history.push('/');
            }
          });
        } else {
          signout();
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token, loading]);

  const handleVerification = async (id) => {
    try {
      setLoading(true);
      const res = await verifyUser(user, token, id);
      if (res.data) {
        setLoading(false);
        toast.success(res.data.msg);
      } else {
        if (res.response && res.response.status === 401) {
          await signout();
          history.push('/');
        }
        if (res.response) {
          setLoading(false);
          toast.error('Something went wrong. Please try again later!');
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error('Something went wrong. Please try again later!');
    }
  };

  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      {loading ? (
        <Spinner />
      ) : (
        <div className='container my-5'>
          <div className='row'>
            {unverifiedUsers.length > 0 &&
              unverifiedUsers.map((unverifiedUser, index) => (
                <div className='col-lg-12 col-md-12 col-12' key={index}>
                  <div
                    className='card text-white cart-card pb-2 mb-4'
                    id='user-card'
                  >
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-lg-4 col-md-4 col-sm-5 col-5'>
                          <img
                            src={`data:${
                              unverifiedUser.photo_id.contentType
                            };base64,${Buffer.from(
                              unverifiedUser.photo_id.data.data
                            ).toString('base64')}`}
                            className='image-fluid photo-id-img'
                            alt='Photo Id img'
                          />
                        </div>

                        <div className='col-lg-8 col-md-8 col-sm-7 col-7'>
                          <div className='row pt-2'>
                            <div className='col-12'>
                              Email:{' '}
                              <span className='ml-1'>
                                {unverifiedUser.email}
                              </span>
                            </div>
                          </div>
                          <div className='row pt-2'>
                            <div className='col-12'>
                              Wallet Address:{' '}
                              <span className='ml-1'>
                                {unverifiedUser.wallet_address}
                              </span>
                            </div>
                          </div>
                          <div className='row pt-2'>
                            <div className='col-12'>
                              Tokens:{' '}
                              <span className='ml-1'>
                                {unverifiedUser.token}
                              </span>
                            </div>
                          </div>
                          <div className='row pt-2'>
                            <div className='col-12'>
                              Referral Code Used:{' '}
                              <span className='ml-1'>
                                {unverifiedUser.referral_code_used
                                  ? unverifiedUser.referral_code_used
                                  : '-'}
                              </span>
                            </div>
                          </div>

                          <div className='row pt-2'>
                            <div className='col-12'>
                              <button
                                className='btn btn-success'
                                onClick={() =>
                                  window.confirm('Are you sure?')
                                    ? handleVerification(unverifiedUser._id)
                                    : ''
                                }
                              >
                                Verify{' '}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(Verification);
