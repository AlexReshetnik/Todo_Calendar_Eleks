import "./Day.scss";
import DnDContaiter from "../../containers/DnDContaiter/DnDContaiter";

function Day({ numeric }) {

  return (
    <div className='Day' id={numeric}>
      <div className="container">
        <div className="numeric">{new Date(numeric).getDate()}</div>
        <DnDContaiter idGroup={numeric}/>
      </div>
    </div>
  );
}
export default Day;
