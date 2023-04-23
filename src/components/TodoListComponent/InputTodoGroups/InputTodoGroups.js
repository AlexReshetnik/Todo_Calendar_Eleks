import './InputTodoGroups.scss';
import {useEffect, useRef, useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {ReactComponent as BlackFolder} from '../../../assets/icons/black_folder.svg';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import {useSelector, useDispatch} from 'react-redux';
import {
  CREATE_GROUP,
  DELETE_GROUP,
  SET_CURRENT_GROUP_ID,
} from '../../../store/groups/types';

function InputTodoGroups() {
  const inputRef = useRef();
  const dropDownList = useRef();
  const dropDownListTimer = useRef();
  const disabled = useRef(true);

  const [isOpenDropDownList, setIsOpenDropDownList] = useState(false);

  const dispatch = useDispatch();
  const currentGroupID = useSelector(state => state.groups.currentGroupID);
  const listGroups = useSelector(state => state.groups.groups);
  const todos = useSelector(state => state.todos.todos);

  const [value, setValue] = useState(
    listGroups.find(i => i.id == currentGroupID)?.title || ''
  );

  function handleChange(e) {
    let value = e.currentTarget.getAttribute('value');
    dispatch({type: SET_CURRENT_GROUP_ID, payload: {groupID: value}});
    setIsOpenDropDownList(false);
  }

  function onChange(e) {
    //if (!e.target.value) return;
    setValue(e.target.value);
    //console.log('setValue');
  }

  function onFocus(e) {
    if (disabled.current) {
      inputRef.current.blur();
    }
  }

  function Open(e) {
    if (!disabled.current && listGroups.length == 0) return;
    if (isOpenDropDownList) {
      setIsOpenDropDownList(false);
    } else setIsOpenDropDownList(true);
  }

  function addHandler() {
    setValue('');
    disabled.current = false;
    inputRef.current.focus();
    inputRef.current.onblur = e => {
      if (!e.target.value) {
        if (currentGroupID) {
          setValue(listGroups.find(i => i.id == currentGroupID).title);
          inputRef.current.onblur = undefined;
          disabled.current = true;
        } else {
          disabled.current = false;
        }
      } else {
        dispatch({type: CREATE_GROUP, payload: {title: e.target.value}});
        inputRef.current.onblur = undefined;
        disabled.current = true;
      }
    };
  }

  function deleteHandler(e) {
    let targetid = e.currentTarget.getAttribute('value');
    dispatch({type: DELETE_GROUP, payload: {deleteID: targetid}});
    e.stopPropagation();
  }

  function mouseout(e) {
    dropDownListTimer.current = setTimeout(() => {
      setIsOpenDropDownList(false);
    }, 500);
  }

  function mouseover(e) {
    clearTimeout(dropDownListTimer.current);
  }

  function keydown(keyPress) {
    if (keyPress.keyCode === 13) {
      inputRef.current.blur();
    }
  }

  useEffect(() => {
    inputRef.current.addEventListener('keydown', keydown);
    return () => {
      inputRef.curren.removeEventListener('keydown', keydown);
    };
  }, [inputRef]);

  useEffect(() => {
    if (listGroups.length > 0) {
      if (!listGroups.find(i => i.id === currentGroupID)) {
        setValue(listGroups[0].title);
      }
    } else {
      addHandler(false);
      setIsOpenDropDownList(false);
    }
  }, [listGroups]);

  useEffect(() => {
    if (currentGroupID) {
      setValue(listGroups.find(i => i.id === currentGroupID).title);
    }
  }, [currentGroupID]);

  useEffect(() => {
    dropDownList.current.addEventListener('mouseover', mouseover);
    dropDownList.current.addEventListener('mouseout', mouseout);
    return () => {
      dropDownList.current.removeEventListener('mouseover', mouseover);
      dropDownList.current.removeEventListener('mouseout', mouseout);
    };
  }, []);

  useEffect(() => {
    if (isOpenDropDownList) dropDownList.current.classList.add('open');
    else dropDownList.current.classList.remove('open');
  }, [isOpenDropDownList]);

  return (
    <div className='InputTodoGroups'>
      <div className='content'>
        <div className='topHeader'>Group</div>
        <input
          type='text'
          placeholder='Create new group...'
          ref={inputRef}
          value={value}
          onClick={Open}
          onChange={onChange}
          onFocus={onFocus}
        />

        <div
          ref={dropDownList}
          className='dropDounList'
          style={{display: isOpenDropDownList ? 'inherit' : 'none'}}>
          {listGroups.map(group => (
            <div
              key={group.id}
              value={group.id}
              className='MenuItem'
              onClick={handleChange}>
              <div className='bloc'>
                <span className='openIcon' value={group.id}>
                  <BlackFolder
                    style={{
                      fill: currentGroupID === group.id ? '#1976d2' : 'black',
                    }}
                  />
                </span>

                {group.title}
              </div>

              <span
                className='deleteIcon'
                value={group.id}
                onClick={deleteHandler}>
                <div className='count'>
                  {
                    todos.filter(
                      i => i.idGroup == group.id && i.isDeleted == false
                    ).length
                  }
                </div>
                <DeleteForeverIcon />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`checkMark ${isOpenDropDownList ? 'active' : ''}`}
        onClick={Open}>
        <ArrowDownwardOutlinedIcon />
      </div>

      <div className='btAdd' onClick={addHandler}>
        <AddIcon />
      </div>
    </div>
  );
}
export default InputTodoGroups;
