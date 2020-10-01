import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles.css';
import Home from './core/Home';
import Navbar from './core/Navbar';
import Footer from './core/Footer';
import PageNotFound from './core/PageNotFound';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import UserDashboard from './user/UserDashboard';
import Verification from './admin/Verification';

function Routes() {
  return (
    <div className='App'>
      <Router>
        <header>
          <Navbar />
        </header>
        <main>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/signup' exact component={Signup} />
            <Route path='/signin' exact component={Signin} />
            <Route path='/user/dashboard' exact component={UserDashboard} />
            <Route
              path='/admin/kyc-verification'
              exact
              component={Verification}
            />
            <Route component={PageNotFound} />
          </Switch>
        </main>
        <footer>
          <Footer />
        </footer>
      </Router>
    </div>
  );
}

export default Routes;
