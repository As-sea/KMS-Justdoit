import Redirect from './Redirect';
import { getCookie } from '../../Services/cookies';
function AuthComponent({ children }) {
  console.log(getCookie());
  return getCookie() ? children : <Redirect to="/login" />;
}

export default AuthComponent;
