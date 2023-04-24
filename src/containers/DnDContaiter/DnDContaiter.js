import {ReactSortable} from 'react-sortablejs';
import {CREATE_TODO, MOVE_TODO, SORT_TODO} from '../../store/todos/types';
import {useDispatch, useSelector} from 'react-redux';
import {memo, useEffect, useRef, useState} from 'react';
import TodoItem from '../../components/TodoItem/TodoItem';

function DnDContaiter({idGroup}) {
  const dispatch = useDispatch();
  let now = new Date(Date.now()).setHours(0, 0, 0, 0);
  const todos = useSelector(
    state => {
      if (idGroup < now) {
        return state.todos.todos.filter(i => i.idGroup == idGroup);
      } else {
        return state.todos.todos.filter(
          i => i.idGroup == idGroup && i.isDeleted == false
        );
      }
    },
    (oldValue, newValue) => {
      return oldValue.length == newValue.length;
    }
  );

  const allTodos = useSelector(
    state => state.todos.todos,
    (oldValue, newValue) => oldValue.length == newValue.length
  );
  const [list, setList] = useState([]);
  const focusItem = useRef();
  function onAdd(e) {
    dispatch({
      type: MOVE_TODO,
      payload: {item: e.item.id, target: e.to.parentNode.parentNode.id},
    });
  }

  function setCurrentTodo(sortList) {
    for (let l = 0; l < sortList.length; l++) {
      allTodos.find(i => i.idTodo == sortList[l].idTodo).key = l;
    }
    setList(sortList);
    dispatch({type: SORT_TODO});
  }

  useEffect(() => {
    setList(todos.sort((a, b) => a.key - b.key));
    if (todos.length === 0) {
      dispatch({type: CREATE_TODO, payload: {idGroup: idGroup, title: ''}});
    }
  }, [todos]);

  useEffect(() => {
    focusItem.current = list.find(i => i.title.length < 1);
  }, [list]);

  return (
    <ReactSortable
      list={list}
      setList={setCurrentTodo}
      style={{
        width: '100%',
        height: '100%',
      }}
      sort={true}
      group='shared'
      animation={200}
      onAdd={onAdd}
      emptyInsertThreshold={2}
      delayOnTouchStart={true}
      ghostClass='sortable-ghost'
      touchStartThreshold={10}>
      {list.map(item => (
        <TodoItem
          key={item.idTodo}
          item={item}
          idGroup={idGroup}
          focusItem={focusItem}
        />
      ))}
    </ReactSortable>
  );
}
export default memo(DnDContaiter, (prev, next) => {
  return prev.idGroup === next.idGroup;
});
