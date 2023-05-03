import {Radio} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import './TodoItem.scss';
import {memo, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {createTodo, deteleTodo, setTitle} from '../../store/todos/actions';

function TodoItem({item, idGroup, focusItem}) {
  const inputRef = useRef();
  const selectionStart = useRef();
  const dispatch = useDispatch();
  const dropDownListTimer = useRef();
  const setTitleTimer = useRef();
  const [title, settitle] = useState(item.title);
  const [isChecked, setIsChecked] = useState(item.isDeleted);
  let now = new Date(Date.now()).setHours(0, 0, 0, 0);
  let isActiveGroup = typeof idGroup === 'string' || idGroup >= now;
  //подія видалення todo
  function handleChange(e) {
    setIsChecked(prev => !prev);
    document.getElementById(`${item.idTodo}`).classList.remove('deleing');
    window.navigator.vibrate(200);
    clearTimeout(dropDownListTimer.current);
    item.isDeleted = !item.isDeleted;
    if (isActiveGroup) {
      document.getElementById(`${item.idTodo}`).classList.add('deleing');
      dropDownListTimer.current = setTimeout(() => {
        dispatch(deteleTodo(item));
        window.navigator.vibrate(50);
      }, 2000);
    } else {
      dispatch(deteleTodo(item));
    }
  }

  //подія onChange
  function inputHandler(e) {
    let str = e.target.value;
    let newStr = str && str[0].toUpperCase() + str.slice(1);
    settitle(newStr);

    if (newStr.length > 2) {
      clearTimeout(setTitleTimer.current);
      setTitleTimer.current = setTimeout(() => {
        dispatch(setTitle(item, newStr));
      }, 1000);
    } else {
      dispatch(setTitle(item, newStr));
    }
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
            dispatch(createTodo(idGroup, 'ㅤ'));
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

  //авто фокус після створення
  useEffect(() => {
    inputRef.current.addEventListener('keydown', keydown);
    if (title == 'ㅤ') {
      settitle('');

      dispatch(setTitle(item, ''));

      inputRef.current.focus();
    }
    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keydown', keydown);
    };
  });
  //if(typeof idGroup ==='string' )
  // style={idGroup < now ? {color: '#a8a8a893'} : {}}
  return (
    <div className='TodoItem' id={item.idTodo} key={item.idTodo}>
      <Radio
        className='Radio'
        checked={isChecked}
        onClick={handleChange}
        value={isChecked}
        style={!isActiveGroup ? {color: '#a8a8a893'} : {}}
      />
      <TextareaAutosize
        aria-label='empty textarea'
        ref={inputRef}
        type='text'
        style={isChecked && !isActiveGroup ? {color: '#a8a8a893'} : {}}
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
