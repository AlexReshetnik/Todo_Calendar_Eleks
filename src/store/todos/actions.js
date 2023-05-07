import {v4 as uuid} from 'uuid';
import * as db from '../../firebase/a';

export const createTodo = (idGroup) => async dispatch => {
  db.createTodo({
    idGroup: idGroup,
    idTodo: uuid(),
    title: 'ㅤ',
    isChecked: false,
    isDeleted: false,
    key: 1000000,
  });
};

export const addTodos = (start,end) => async (dispatch, getState) => {
  db.addTodos(dispatch,start,end);
};

export const setTitle = (todo, title) => async dispatch => {
  db.setTitle(todo, title);
};

export const deteleTodo = todo => async (dispatch, getState) => {
  db.deteleTodo(todo);
};

export const moveTodo = (idTodo, target) => async (dispatch, getState) => {
  let todo = getState().todos.todos.find(i => i.idTodo == idTodo)
  db.moveTodo(todo, target);
};

export const sortTodo = sortList => async dispatch => {
  db.sortTodo(sortList);
};
