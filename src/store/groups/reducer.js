import {addNewGroup, getGroups} from '../../firebase/a';
import {
  SET_CURRENT_GROUP_ID,
  CREATE_GROUP,
  DELETE_GROUP,
  SET_GROUPS,
} from './types';
import {v4 as uuid} from 'uuid';

// variables
const USER_DATA_KEY = 'GROUPS'; // name of localStorage key
let LSdata = localStorage.getItem(USER_DATA_KEY);


setTimeout(() => {
  const USER_DATA_KEY = 'GROUPS';
  let LSdata = localStorage.getItem(USER_DATA_KEY);
  if (LSdata) {
    let groups = JSON.parse(LSdata);
    console.log(groups);
    groups.groups.forEach(el => {
      addNewGroup(el.id,el.title);
    });
    localStorage.removeItem(USER_DATA_KEY)
  }
}, 3000);


let initialState = {
  currentGroupID: null,
  groups: [{id: 0, title: ''}],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      state = {...state, groups: action.payload.groups};

      break;
    case SET_CURRENT_GROUP_ID:
      state = {...state, currentGroupID: action.payload.id};

      break;
    case CREATE_GROUP:
      state = {
        ...state,
        currentGroupID: action.payload.id,
        groups: [
          ...state.groups,
          {title: action.payload.title, id: action.payload.id},
        ],
      };
      break;

    case DELETE_GROUP:
      state = {
        ...state,
        groups: [...state.groups.filter(i => i.id !== action.payload.id)],
        currentGroupID:
          state.currentGroupID === action.payload.id
            ? null
            : state.currentGroupID,
      };

      break;
  }
  //localStorage.setItem(USER_DATA_KEY, JSON.stringify(state));
  state.groups = state.groups.slice();
  return state;
};

export default groupsReducer;
