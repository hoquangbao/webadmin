import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import 'antd/dist/antd.css';

import ErrorBoundary from './components/error-boundary/error-boundary';
import ScrollToTop from './components/scroll-to-top/scroll-to-top.component';

import Creators from './redux/user'

// load lazy
const Page404 = React.lazy(() => import('./views/page404'))
const AuthLayout = React.lazy(() => import('./layouts/auth-layout'))
const DashboardLayout = React.lazy(() => import('./layouts/dashboard-layout'))
// end lazy

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    // const { checkUserSession } = this.props;
    // checkUserSession();
  }

  componentWillUnmount() {
    // this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Switch>
          <ErrorBoundary>
            <ScrollToTop>
              <Suspense fallback={<></>}>
                <Switch>
                  <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
                  <Route path="/app" name="Default" render={(props) => <DashboardLayout {...props} />} />
                  <Route path="/" name="Auth" render={(props) => <AuthLayout {...props} />} />
                </Switch>
              </Suspense>
            </ScrollToTop>
          </ErrorBoundary>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = (dispatch) => ({
  // checkUserSession: () => dispatch(Creators.checkUserSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
