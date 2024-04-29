import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// import CoreLayout from '../layouts/CoreLayout1'
// import Home from './Dashboard'
// import LoginRoute from './Login'
import SignInRoute from './SignIn'
// import SignupRoute from './Signup'
import ProjectsRoute from './Projects'
import DashboardRoute from './Dashboard'
import DownloadRoute from './Download'
// import AccountRoute from './Account'
import NotFoundRoute from './NotFound'
import UserListRoute from './Users'
import UserPageRoute from './Users/routes/User'
import SettingsPage from './Settings'

import Minimal from '../layouts/Minimal'
import Main from '../layouts/Main'

export default function createRoutes(store) {
  // return (
  //     <Switch>
  //       <Route exact path={Home.path} component={() => <Home.component />} />
  //       {/* Build Route components from routeSettings */
  //       [
  //         AccountRoute,
  //         SignupRoute,
  //         LoginRoute
  //         /* Add More Routes Here */
  //       ].map((settings, index) => (
  //         <Route key={`Route-${index}`} {...settings} />
  //       ))}
  //       {/* Build Route components from routeSettings */
  //       [
  //         ProjectsRoute
  //         /* Add More Routes Here */
  //       ].map((settings, index) => (
  //         <Main><Route key={`Route-Main-${index}`} {...settings} /></Main>
  //       ))}
  //       <Route component={NotFoundRoute.component} />
  //     </Switch>
  // )
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to={SignInRoute.path}
      />
      <Route
        exact
        path={SignInRoute.path}
        render={matchProps => (
          <Minimal>
            <SignInRoute.component {...matchProps} />
          </Minimal>
        )}
      />
      <Route
        exact
        path={ProjectsRoute.path}
        render={matchProps => (
          <Main>
            <ProjectsRoute.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={DashboardRoute.path}
        render={matchProps => (
          <Main>
            <DashboardRoute.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={UserListRoute.path}
        render={matchProps => (
          <Main>
            <UserListRoute.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={UserListRoute.path+"/:userId"}
        render={matchProps => (
          <Main>
            <UserPageRoute.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={DownloadRoute.path}
        render={matchProps => (
          <Main>
            <DownloadRoute.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={SettingsPage.path}
        render={matchProps => (
          <Main>
            <SettingsPage.component {...matchProps} />
          </Main>
        )}
      />
      <Route
        exact
        path={NotFoundRoute.path}
        render={matchProps => (
          <Minimal>
            <NotFoundRoute.component {...matchProps} />
          </Minimal>
        )}
      />
    </Switch>
)
}
