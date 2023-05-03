import {ReactSortable} from 'react-sortablejs';
import {useDispatch, useSelector} from 'react-redux';
import {memo, useEffect, useRef, useState} from 'react';
import TodoItem from '../../components/TodoItem/TodoItem';
import {createTodo, moveTodo, sortTodo} from '../../store/todos/actions';

function DnDContaiter({idGroup}) {
  const dispatch = useDispatch();
  const containerRef = useRef();
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
    dispatch(moveTodo(e.item.id, e.to.parentNode.parentNode.parentNode.id));
  }

  function setCurrentTodo(sortList) {
    if (sortList.length == 0) return;
    for (let l = 0; l < sortList.length; l++) {
      allTodos.find(i => i.idTodo == sortList[l].idTodo).key = l;
    }
    console.log(sortList);
    setList(sortList);
    dispatch(sortTodo(sortList));
  }
  function onClickHandler(e) {
    if (e.target.parentNode === containerRef.current) {
      let item = todos.find(i => i.title.length <= 1);
      if (item == undefined) {
        dispatch(createTodo(idGroup, 'ㅤ'));
      } else {
        let el = document.getElementById(item.idTodo);
        console.dir(el);
        el.childNodes[1].focus();
      }
    }
  }

  useEffect(() => {
    setList(todos.sort((a, b) => a.key - b.key));
  }, [todos]);

  useEffect(() => {
    focusItem.current = list.find(i => i.title?.length < 1);
  }, [list]);

  return (
    <div
      className='DnDContaiter'
      ref={containerRef}
      style={{width: '100%', height: '100%'}}
      onClick={onClickHandler}>
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
    </div>
  );
}
export default memo(DnDContaiter, (prev, next) => {
  return prev.idGroup === next.idGroup;
});
