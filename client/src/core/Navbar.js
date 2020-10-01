import React, { Fragment } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/helper/index';

const Navbar = ({ history }) => {
  return (
    <Fragment>
      <nav className='navbar navbar-expand-lg bg-dark'>
        <h4 className=''>
          <Link to='/'>{' The Golden M'}</Link>
        </h4>

        <ul className=''>
          <li>
            <NavLink activeClassName='activeLink' exact to='/'>
              <i className='fa fa-home text-white mr-1 nav-icons'> </i>
              <span className='hide-sm'>{' Home'}</span>
            </NavLink>
          </li>
          {!isAuthenticated() && (
            <li>
              <NavLink activeClassName='activeLink' to='/signup'>
                <i className='fas fa-user-plus text-white mr-1 nav-icons'> </i>
                <span className='hide-sm'>{'  Sign Up'}</span>{' '}
              </NavLink>
            </li>
          )}
          {!isAuthenticated() && (
            <li>
              <NavLink activeClassName='activeLink' to='/signin'>
                <i className='fa fa-sign-in text-white mr-1 nav-icons'> </i>
                <span className='hide-sm'>{'  Log In'}</span>{' '}
              </NavLink>
            </li>
          )}
          {isAuthenticated() && (
            <li>
              <NavLink activeClassName='activeLink' to='/user/dashboard'>
                <i className='fa fa-user-circle text-white mr-1 nav-icons'> </i>
                <span className='hide-sm'>{' Account'}</span>
              </NavLink>
            </li>
          )}
          {isAuthenticated() && (
            <li>
              <span
                className='text-white'
                style={{
                  cursor: 'pointer',
                  paddingRight: '0.7rem',
                  margin: '0 1rem',
                }}
                onClick={() => {
                  signout();
                  history.push('/');
                }}
              >
                <i className='fa fa-sign-out-alt text-white mr-1 nav-icons'></i>
                <span className='hide-sm'>{' Logout'}</span>
              </span>
            </li>
          )}
        </ul>
      </nav>
    </Fragment>
  );
};

export default withRouter(Navbar);
