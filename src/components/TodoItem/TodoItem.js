import {Radio} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import './TodoItem.scss';
import {memo, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  CHANGE_TODO,
  CREATE_TODO,
  DELETE_TODO,
  SET_TITLE,
} from '../../store/todos/types';

function TodoItem({item, idGroup, focusItem}) {
  const inputRef = useRef();
  const selectionStart = useRef();
  const dispatch = useDispatch();
  const dropDownListTimer = useRef();
  const [title, settitle] = useState(item.title);
  const [isChecked, setIsChecked] = useState(item.isDeleted);
  let now = new Date(Date.now()).setHours(0, 0, 0, 0);

  //подія видалення todo
  function handleChange(e) {
    setIsChecked(prev => !prev);
    document.getElementById(`${item.idTodo}`).classList.remove('deleing');
    clearTimeout(dropDownListTimer.current);
    item.isDeleted = !item.isDeleted;
    if (idGroup >= now) {
      document.getElementById(`${item.idTodo}`).classList.add('deleing');
      dropDownListTimer.current = setTimeout(() => {
        dispatch({type: DELETE_TODO, payload: item});
      }, 2000);
    } else {
      dispatch({type: DELETE_TODO, payload: item});
    }
  }

  //подія onChange
  function inputHandler(e) {
    let str = e.target.value;
    let newStr = str && str[0].toUpperCase() + str.slice(1);
    settitle(newStr);
    dispatch({
      type: SET_TITLE,
      payload: {idTodo: item.idTodo, title: newStr},
    });
  }

  function onFocus(e) {
    inputRef.current.isCanCreacte = true;
  }

  function onBlur(e) {
    inputRef.current.isCanCreacte = false;
  }

  //натискаємо enter
  function keydown(e) {
    if (e.keyCode === 13) {
      if (e.ctrlKey) {
        //додаємо переніс рядка
        let text = [...title];
        text.splice(e.target.selectionStart, 0, `\n`);
        settitle(text.join(''));
        selectionStart.current = e.target.selectionStart;
      } else {
        if (
          inputRef.current.isCanCreacte === true &&
          title !== '' &&
          title !== 'ㅤ'
        ) {
          if (focusItem.current && focusItem.current.idTodo != item.idTodo) {
            let el = document.getElementById(focusItem.current.idTodo)
              .childNodes[1];
            el.focus();
          } else {
            dispatch({
              type: CREATE_TODO,
              payload: {idGroup: idGroup, title: 'ㅤ'},
            });
          }
          focusItem.current = null;
        }
      }
      e.preventDefault();
    }
  }

  //встановлюємо курсор в минуле місце
  useEffect(() => {
    if (selectionStart.current) {
      inputRef.current.setSelectionRange(
        selectionStart.current + 1,
        selectionStart.current + 1
      );
      selectionStart.current = null;
    }
  }, [title]);

  //якщо відмічений то обертаємо стан на невідмічений
  useEffect(() => {
    if (isChecked === true) {
      //dispatch({type: CHANGE_TODO, payload: item});
    }
  }, []);

  //авто фокус після створення
  useEffect(() => {
    inputRef.current.addEventListener('keydown', keydown);
    if (title == 'ㅤ') {
      settitle('');
      dispatch({
        type: SET_TITLE,
        payload: {idTodo: item.idTodo, title: ''},
      });
      inputRef.current.focus();
    }
    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keydown', keydown);
    };
  });

  return (
    <div className='TodoItem' id={item.idTodo} key={item.idTodo}>
      <Radio
        className='Radio'
        checked={isChecked}
        onClick={handleChange}
        value={isChecked}
        style={idGroup < now?{color: "#a8a8a893"}:{}}
      />
      <TextareaAutosize
        aria-label='empty textarea'
        ref={inputRef}
        type='text'
        value={title}
        onChange={inputHandler}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}

export default memo(TodoItem, (prev, next) => {
  return (
    prev.item.idGroup == next.item.idGroup &&
    prev.item.idTodo == next.item.idTodo &&
    prev.item.title == next.item.title &&
    !next.isChecked &&
    prev.item.isDeleted == next.item.isDeleted &&
    prev.item.key == next.item.key &&
    prev.idGroup == next.idGroup &&
    prev.focusItem.current == next.focusItem.current
  );
});
