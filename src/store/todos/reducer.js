import {
  DELETE_TODOS,
  MODIFIED_TODOS,
  ADD_TODOS,
} from './types';

let initialState = {
  todos: [],
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODOS:
      state = {
        ...state,
        todos: [
          ...state.todos.filter(i => i.idTodo !== action.payload.todo.idTodo),
          action.payload.todo,
        ],
      };
      break;



    case DELETE_TODOS:
      state = {
        ...state,
        todos: state.todos.filter(i => i.idTodo !== action.payload.todo.idTodo),
      };
      break;
    case MODIFIED_TODOS:
      state = {
        ...state,
        todos: [
          ...state.todos.filter(i => i.idTodo !== action.payload.todo.idTodo),
          action.payload.todo,
        ],
      };
      break;

  }

  state.todos = state.todos.slice();
  return {...state, todos: state.todos};
};

export default todosReducer;
