import './Day.scss';
import DnDContaiter from '../../containers/DnDContaiter/DnDContaiter';
import {memo} from 'react';

function Day({numeric, className = ''}) {
  return (
    <div className={`Day ${className}`} id={numeric}>
      <div className='container'>
        <div className='numeric'>{new Date(numeric).getDate()}</div>
        <DnDContaiter idGroup={numeric} />
      </div>
    </div>
  );
}

export default memo(Day, (prev, next) => {
  return prev.numeric === next.numeric && prev.className === next.className;
});
