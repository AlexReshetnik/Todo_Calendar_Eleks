import {v4 as uuid} from 'uuid';
import {
  CREATE_GROUP,
  DELETE_GROUP,
  SET_CURRENT_GROUP_ID,
  SET_GROUPS,
} from './types';
import * as db from '../../firebase/a';
import {createTodo} from '../todos/actions';

export const createGroup = title => async dispatch => {
  let id = uuid();
  await db.addNewGroup(id, title, dispatch);
  dispatch(createTodo(id, 'ㅤ'));
  dispatch({type: CREATE_GROUP, payload: {id: id, title: title}});
};

export const setGroups = () => async dispatch => {
  let groups = await db.getGroups();
  dispatch({type: SET_GROUPS, payload: {groups: groups}});

  let id = await db.setCurrentGroup();
  dispatch({type: SET_CURRENT_GROUP_ID, payload: {id: id}});
};

export const deleteGroup = id => async dispatch => {
  await db.deleteGroup(id);
  dispatch({type: DELETE_GROUP, payload: {id: id}});
};

export const setCurrentGroup = id => async dispatch => {
  id = await db.setCurrentGroup(id);
  dispatch({type: SET_CURRENT_GROUP_ID, payload: {id: id}});
};
