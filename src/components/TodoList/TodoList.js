import "./TodoList.scss";
import {  useSelector } from "react-redux";
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
