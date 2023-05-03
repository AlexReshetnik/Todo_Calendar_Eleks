import {v4 as uuid} from 'uuid';
import * as db from '../../firebase/a';

export const createTodo = (idGroup, title) => async dispatch => {
  db.createTodo({
    idGroup: idGroup,
    idTodo: uuid(),
    title: title,
    isChecked: false,
    isDeleted: false,
    key: 1000000,
  });
};

export const addTodos = () => async (dispatch, getState) => {
  db.addTodos(dispatch);
};

export const setTitle = (todo, title) => async dispatch => {
  db.setTitle(todo, title);
};

export const deteleTodo = todo => async (dispatch, getState) => {
  db.deteleTodo(todo);
};

export const moveTodo = (item, target) => async (dispatch, getState) => {
  db.moveTodo(item, target, getState().todos.todos);
};

export const sortTodo = sortList => async dispatch => {
  db.sortTodo(sortList);
};
