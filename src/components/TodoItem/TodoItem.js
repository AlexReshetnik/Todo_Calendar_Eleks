import { Radio } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import "./TodoItem.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_TODO, CREATE_TODO, DELETE_TODO, SET_TITLE } from "../../store/todos/types";

function TodoItem({ item, idGroup }) {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const dropDownListTimer = useRef();
  const [title, settitle] = useState(item.title);

  function handleChange(e) {
    dispatch({ type: CHANGE_TODO, payload: item });
    clearTimeout(dropDownListTimer.current);
    if (item.isCheked === true) {
      dropDownListTimer.current = setTimeout(() => {
        dispatch({ type: DELETE_TODO, payload: item });
      }, 2000);
    }
  }

  function inputHandler(e) {
    settitle(e.target.value);
    dispatch({
      type: SET_TITLE,
      payload: { idTodo: item.idTodo, title: e.target.value },
    });
  }

  function onFocus(e) {
    inputRef.current.isCanCreacte = true;
  }

  function onBlur(e) {
    inputRef.current.isCanCreacte = false;
  }

  function keydown(e) {
    if (e.keyCode === 13) {
      if (e.ctrlKey) {
        settitle(title + `
`)
      } else {
        if (inputRef.current.isCanCreacte === true && title !== "" && title !== "ㅤ") {
          dispatch({ type: CREATE_TODO, payload: { idGroup: idGroup, title: "ㅤ" } });
        }
      }
      e.preventDefault()
    }
  }

  useEffect(() => {
    inputRef.current.addEventListener("keydown", keydown);
    if (title === "ㅤ") {
      settitle("");
      dispatch({
        type: SET_TITLE,
        payload: { idTodo: item.idTodo, title: "" },
      });
      inputRef.current.focus();
    }
    return () => {
      if (inputRef.current) inputRef.current.removeEventListener("keydown", keydown);
    }
  });

  return (
    <div className='TodoItem' id={item.idTodo} key={item.idTodo}>
      <Radio className='Radio' checked={item.isCheked} onClick={handleChange} value={item.isCheked} />
      <TextareaAutosize aria-label='empty textarea' ref={inputRef} type='text' value={title} onChange={inputHandler} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}
export default TodoItem;
