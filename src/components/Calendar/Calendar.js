import {memo, useEffect, useRef, useState} from 'react';
import Day from '../Day/Day';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import {SET_END, SET_START} from '../../store/user/types';
import roundOFF from '../../Methods/roundOFF';

function Calendar() {
  let calendar = useRef();

  let startRef = useRef();
  let endRef = useRef();
  let day = 3600 * 24 * 1000;

  const dispatch = useDispatch();

  const start = useSelector(state => state.user.start);
  const end = useSelector(state => state.user.end);

  /*let [start, setStart] = useState(
    new Date(localStorage.getItem('start') || roundOFF(Date.now()))
  );
  let [end, setEnd] = useState(
    new Date(localStorage.getItem('end') || roundOFF(Date.now() + day * 30))
  );*/
  let now = new Date(Date.now()).setHours(0, 0, 0, 0);

  setInterval(() => {
    if (now != new Date(Date.now()).setHours(0, 0, 0, 0)) {
      window.location.reload();
    }
  }, 1000 * 60 * 5);
  let countDays = (end - start) / day;

  function generate() {
    let res = [];

    for (let i = 0; i <= countDays; i++) {
      let numeric = new Date(+start + i * day).setHours(0, 0, 0, 0);
      res.push(
        <Day
          key={numeric}
          className={`${numeric == now ? 'now' : ''}`}
          numeric={numeric}
        />
      );
    }
    return res;
  }

  function onChangeSTART(e) {
    dispatch({type: SET_START, payload: {start: roundOFF(e.target.value)}});
  }

  function onChangeEND(e) {
    dispatch({type: SET_END, payload: {end: roundOFF(e.target.value, 6)}});
  }

  function timeToString(time) {
    let arr = new Date(time).toLocaleDateString().split('.');
    return `${arr[2]}-${arr[1]}-${arr[0]}`;
  }

  useEffect(() => {
    startRef.current.value = timeToString(start);
    endRef.current.value = timeToString(end);
  }, [start, end]);

  return (
    <div
      ref={calendar}
      className={`Calendar ${
        /*navigator.userAgentData.mobile ? 'phone':''*/ ''
      }`}>
      <header>
        <input
          ref={startRef}
          type='date'
          id='birthday'
          name='birthday'
          onChange={onChangeSTART}
        />
        <input
          ref={endRef}
          type='date'
          id='birthday'
          name='birthday'
          onChange={onChangeEND}
        />
      </header>

      <div className='box'>{generate()}</div>
    </div>
  );
}
export default memo(Calendar, () => true);
