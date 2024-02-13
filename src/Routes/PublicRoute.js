import React from "react";
import { Route } from "react-router-dom";
function PublicRoute({ component: Component, headerTitle, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <div>
            <Component {...props} />
          </div>
        );
      }}
    />
  );
}

export default PublicRoute;
