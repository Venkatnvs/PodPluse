import { AUTH_FAIL, FETCH_USER_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS, SET_USER } from "@/constants/actions/AuthConstants";
import Cookies from "js-cookie";

const initialState = {
  authTokens: {
    access: Cookies.get("access_token"),
    refresh: Cookies.get("refresh_token"),
  },
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        authTokens: action.payload,
        error: null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case LOGOUT:
      return {
        authTokens: null,
        user: null,
        error: null,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case AUTH_FAIL:
    case FETCH_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
