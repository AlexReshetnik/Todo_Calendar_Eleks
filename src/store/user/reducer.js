import roundOFF from '../../Methods/roundOFF';
import {SET_END, SET_START, USER_AUTH} from './types';

let day = 3600 * 24 * 1000;

let initialState = {
  isAuth: false,
  start: new Date(localStorage.getItem('start')) || roundOFF(Date.now()),
  end: new Date(localStorage.getItem('end')) || roundOFF(Date.now() + day * 30),
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH:
      console.log(USER_AUTH);
      return {...state, isAuth: true};
    case SET_START:
      console.log(SET_START);
      localStorage.setItem('start', action.payload.start);
      return {...state, start: action.payload.start};
    case SET_END:
      console.log(SET_END);
      localStorage.setItem('end', action.payload.end);
      return {...state, end: action.payload.end};

    default:
      return state;
  }
};

export default userReducer;
