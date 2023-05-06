import {addNewGroup, getGroups} from '../../firebase/a';
import {
  SET_CURRENT_GROUP_ID,
  CREATE_GROUP,
  DELETE_GROUP,
  SET_GROUPS,
} from './types';

let initialState = {
  currentGroupID: null,
  groups: [],
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
 
  state.groups = state.groups.slice();
  return state;
};

export default groupsReducer;
