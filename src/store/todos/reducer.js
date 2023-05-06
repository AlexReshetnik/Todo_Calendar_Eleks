import {DELETE_TODOS, MODIFIED_TODOS, ADD_TODOS} from './types';

let initialState = {
  todos: [],
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODOS: {
      let index = state.todos.findIndex(
        i => i.idTodo === action.payload.todo.idTodo
      );
      if (index == -1) {
        return {
          ...state,
          todos: [...state.todos, action.payload.todo],
        };
      } else {
        return {
          ...state,
          todos: [...state.todos],
        };
      }
    }
    case DELETE_TODOS:
      return {
        ...state,
        todos: [
          ...state.todos.filter(i => i.idTodo !== action.payload.todo.idTodo),
        ],
      };

    case MODIFIED_TODOS:
      let index = state.todos.findIndex(
        i => i.idTodo === action.payload.todo.idTodo
      );
      state.todos[index] = action.payload.todo;
      return {
        ...state,
        todos: [...state.todos],
      };

    default:
      return state;
  }
};

export default todosReducer;
