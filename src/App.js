import SplitPane, {Pane} from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import './App.scss';
import Calendar from './components/Calendar/Calendar';
import TodoListComponent from './components/TodoListComponent/TodoListComponent';
import {useState} from 'react';

function App() {
  const [sizes, setSizes] = useState(
    JSON.parse(localStorage.getItem('sizes')) || ['30%', 'auto']
  );
  localStorage.setItem('sizes',JSON.stringify(sizes));

  const layoutCSS = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className='App'>
      <div className='container'>
        <SplitPane sizes={sizes} onChange={setSizes}>
          <Pane initialSize='30%' minSize='200px' maxSize='50%'>
            <TodoListComponent style={{...layoutCSS, background: '#ddd'}} />
          </Pane>
          <Pane initialSize='70%' minSize='50%' maxSize='90%'>
            <Calendar style={{...layoutCSS, background: '#ddd'}} />
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
