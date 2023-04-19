import { useEffect, useRef, useState } from "react";
import Day from "../Day/Day";
import "./Calendar.scss";

function Calendar() {
  let startRef = useRef()
  let endRef = useRef()


  let [start, setStart] = useState(new Date(localStorage.getItem("start") || Date.now()))
  let [end, setEnd] = useState(new Date(localStorage.getItem("end")|| '2024-01-01' ))


  let day = (3600 * 24 * 1000)
  let paddintStart = start.getDay() * 100;
  let countDays = (end - start) / day;
  console.log(countDays);

  function generate() {
    let res = [];
    for (let i = 0; i < countDays; i++) {
      let numeric = new Date(+start + i * day).setHours(0, 0, 0, 0)
      res.push(<Day key={numeric} numeric={numeric} />);
    }
    return res;
  }

  function onChangeSTART(e) {
    setStart(new Date(e.target.value))
  }

  function onChangeEND(e) {
    setEnd(new Date(e.target.value))
  }

  useEffect(() => {
    localStorage.setItem("start", start)
    localStorage.setItem("end", end)
    startRef.current.value = start.toISOString().slice(0, 10);
    endRef.current.value = end.toISOString().slice(0, 10);
  }, [start, end]);

  return <div className='Calendar'>
    <header>
      <input ref={startRef} type="date" id="birthday" name="birthday" onChange={onChangeSTART} />
      <input ref={endRef} type="date" id="birthday" name="birthday" onChange={onChangeEND} />
    </header>

    <div className="box">
      {generate()}
    </div>
  </div>;
}
export default Calendar;
