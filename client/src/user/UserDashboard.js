import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { isAuthenticated, signout } from '../auth/helper';
import { getUser } from './helper';
import Spinner from '../core/Spinner';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const UserDashboard = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(user, token)
      .then((res) => {
        if (res.data) {
          setUserDetails(res.data);
          setLoading(false);
        } else {
          signout();
          history.push('/signin');
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error('Something went wrong. Please try again later!');
      });
  }, [token]);
  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      {loading ? (
        <Spinner />
      ) : (
        <div className='container my-5'>
          {userDetails.role === 1 && (
            <div className='row mb-3'>
              <div className='col-lg-4 ml-lg-4'>
                <Link to='/admin/kyc-verification'>
                  <button className='btn btn-success rounded'>
                    View KYC Requests
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div className='row'>
            <div className='col-lg-8 ml-lg-4 col-md-12 col-sm-12 col-12'>
              <div className='card mb-4 '>
                <h4 className='card-header card-borders font-sm-head'>
                  <i className='fa fa-user fa-sm mr-1 '></i>{' '}
                  {userDetails.role === 0
                    ? 'User Information'
                    : 'Admin Information'}
                </h4>
                <ul className='list-group font-sm-body'>
                  <li className='list-group-item card-item'>
                    <span className='badge badge-success mr-2'>Email:</span>{' '}
                    {userDetails.email}
                  </li>
                  <li className='list-group-item card-item'>
                    <span className='badge badge-success mr-2'>
                      Wallet Address:
                    </span>{' '}
                    {userDetails.wallet_address}
                  </li>
                  <li className='list-group-item card-item'>
                    <span className='badge badge-success mr-2'>
                      KYC Verification:
                    </span>{' '}
                    {userDetails.verification ? 'Done' : 'Pending'}
                  </li>
                  {userDetails.verification && (
                    <li className='list-group-item card-item'>
                      <span className='badge badge-success mr-2'>
                        Your Referral Code:
                      </span>{' '}
                      {userDetails.own_referral_code}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(UserDashboard);
