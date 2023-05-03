import { USER_AUTH } from "./types";

let initialState = {
  isAuth: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH:
			console.log(USER_AUTH);
      return {...state, isAuth: true};

    default:
      return state;
  }
};

export default userReducer;
