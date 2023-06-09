import InputTodoGroups from '../InputTodoGroups/InputTodoGroups';
import TodoList from '../TodoList/TodoList';
import './TodoListComponent.scss';
import {memo} from 'react';

function TodoListComponent() {
  return (
    <div
      className={`TodoListComponent`}>
      <InputTodoGroups />
      <TodoList />
    </div>
  );
}
export default memo(TodoListComponent, () => true);
