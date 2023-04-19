import TodoItem from "../TodoItem/TodoItem";
import "./TodoList.scss";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_TODO } from "../../store/todos/types";
import { ReactSortable } from "react-sortablejs";
import { useEffect, useRef, useState } from "react";
import DnDContaiter from "../../containers/DnDContaiter/DnDContaiter";


function TodoList({ }) {
  const currentGroupID = useSelector(state => state.groups.currentGroupID);

  return (
    <div className='TodoList' key={currentGroupID} id={currentGroupID}>
      <div className='container'>
        <DnDContaiter idGroup={currentGroupID} />
      </div>
    </div>
  );
}
export default TodoList;
