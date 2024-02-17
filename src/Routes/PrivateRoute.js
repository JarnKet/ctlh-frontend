import React from "react";
import { Route } from "react-router-dom";
function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  let isAuthenticated = true;

  const userAccessString = localStorage.getItem('userAccess');
        const userAccess = userAccessString ? JSON.parse(userAccessString) : null;
        // console.log("Login Data", userAccess);
  return (
    <Route
      {...rest}
      render={props =>
        userAccess ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
          <Component {...props} />
        )
      }
      
    />
  );
}

export default PrivateRoute;
