

import { ReactSortable } from "react-sortablejs";
import { CREATE_TODO, MOVE_TODO, SORT_TODO } from "../../store/todos/types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TodoItem from "../../components/TodoItem/TodoItem";

function DnDContaiter({ idGroup }) {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.todos);
  const [list, setList] = useState([]);

  function onAdd(e) {
    dispatch({ type: MOVE_TODO, payload: { item: e.item.id, target: e.to.parentNode.parentNode.id } })
  }

  function setCurrentTodo(params) {
    for (let l = 0; l < params.length; l++) {
      todos.find(i => i.idTodo == params[l].idTodo).key = l
    }
    setList(params)
    dispatch({ type: SORT_TODO })
  }

  useEffect(() => {

    setList(todos
      .filter(i => i.idGroup == idGroup && i.isDeleted === false)
      .sort((a, b) => a.key - b.key))

    if (todos.filter(i => i.idGroup == idGroup && i.isDeleted === false).length === 0) {
      console.log('dispatch');
      dispatch({ type: CREATE_TODO, payload: { idGroup: idGroup, title: "" } });
    }

  }, [todos])

  return (
    <ReactSortable list={list} setList={setCurrentTodo} style={
      {
        width: '100%',
        height: '100%',
      }
    } sort={true}
      group='shared'
      animation={200}
      onAdd={onAdd}
      emptyInsertThreshold={2}
      delayOnTouchStart={true}
      ghostClass='sortable-ghost'
      touchStartThreshold={10}>
      {list.map(item => (
        <TodoItem key={item.idTodo} item={item} idGroup={idGroup} />
      ))}
    </ReactSortable>
  );
}
export default DnDContaiter;
