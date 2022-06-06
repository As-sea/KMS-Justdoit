import React from 'react';
import { Navigate, Route } from 'react-router';
import { getCookie } from '../../Services/cookies';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Redirect({ to }) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => (getCookie() ? <Component {...props} /> : <Redirect to="/login" />)} />;
};
export { PrivateRoute };

// export default class PrivateRoute extends Component {
//   render() {
//     return (
//       <div>PrivateRoute</div>
//     )
//   }
// }
