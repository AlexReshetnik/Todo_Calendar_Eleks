import { CHANGE_TODO, CREATE_TODO, DELETE_TODO, MOVE_TODO, SET_TITLE, SORT_TODO } from "./types";
import { v4 as uuid } from 'uuid';
// variables
const USER_DATA_KEY = "TODOS"; // name of localStorage key
let LSdata = localStorage.getItem(USER_DATA_KEY);

let initialState =
  LSdata !== null
    ? JSON.parse(LSdata)
    : {
      todos: [],
    };

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TODO:
      state.todos.push({
        idGroup: action.payload.idGroup,
        idTodo: uuid(),
        title: action.payload.title,
        isCheked: false,
        isDeleted: false,
        key: 0
      });
      state = {
        ...state,
        todos: state.todos,
      };

      break;
    case CHANGE_TODO:
      state.todos.find(i => i.idTodo === action.payload.idTodo).isCheked = !action.payload.isCheked;
      state = {
        ...state,
        todos: state.todos,
      };
      break;
    case DELETE_TODO:
      state.todos.find(i => i.idTodo === action.payload.idTodo).isDeleted = true;
      state = {
        ...state,
        todos: state.todos,
      };

      break;
    case SET_TITLE:
      state.todos.find(i => i.idTodo === action.payload.idTodo).title = action.payload.title;
      break;

    case MOVE_TODO:
      state.todos.find(i => i.idTodo == action.payload.item).idGroup = action.payload.target
      state = {
        ...state,
        todos: state.todos,
      };
      break;
    case SORT_TODO:
     
      break;
  }

  if (action.type != SET_TITLE) state.todos = state.todos.slice();
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(state));
  return { ...state };
};

export default todosReducer;
