import { useNavigate } from "react-router-dom";
import {
  clearUserDetails,
  getToken,
  getUserInfoFromStorage,
} from "../utils/storage";
import AuthStore from "pages/OnBoarding/SignIn/store";
import { observer } from "mobx-react-lite";
function useAuth() {
  const { logoutUser, setCurrentUser } = AuthStore;
  const currentUser = {};
  const userData = getUserInfoFromStorage();
  const token = getToken();
  const navigate = useNavigate();
  function checkSessionValidity() {
    try {
      return !!token;
    } catch (err) {
      return false;
    }
  }

  async function logout() {
    try {
      clearUserDetails();
      logoutUser();
      navigate("/");
      window.location.reload();
    } catch (error) {
      return error;
    }
  }

  function setAuthenticatedUser(result) {
    setCurrentUser(result);
  }

  function initUserSession() {
    if (checkSessionValidity()) {
      setAuthenticatedUser({ ...userData, token });
      // dispatch(authActions.fetchBusinesses());
      return;
    }
    setAuthenticatedUser({});
  }

  return {
    currentUser,
    checkSessionValidity,
    initUserSession,
    setAuthenticatedUser,
    isAuthenticated: checkSessionValidity(),
    logout,
  };
}

export default useAuth;
