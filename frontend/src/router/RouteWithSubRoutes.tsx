import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { RouteProps } from 'router/Config';

export const RouteWithSubRoutes = (route: RouteProps) => {
  //   /** Authenticated flag */
  const authenticated = true; // TODO : There is no authentication for release 1, we should not push this to develop

  /*eslint-disable */
  return (
    <Suspense fallback={route.fallback}>
      <Route
        path={route.path}
        render={(props) =>
          route.redirect ? (
            <Redirect to={route.redirect} />
          ) : route.private ? (
            authenticated ? (
              route.component && (
                <route.component {...props} routes={route.children} />
              )
            ) : (
              <Redirect to="/" />
            ) // If not authenticated, redirect to '/'
          ) : (
            route.component && (
              <route.component {...props} routes={route.children} />
            )
          )
        }
      />
    </Suspense>
  );
  /* eslint-enable */
};
