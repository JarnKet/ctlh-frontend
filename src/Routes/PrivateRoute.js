import React from 'react'
import { Route } from 'react-router-dom'
function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  let isAuthenticated = true
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default PrivateRoute
