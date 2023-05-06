import SplitPane, {Pane} from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import './App.scss';
import Calendar from './components/Calendar/Calendar';
import TodoListComponent from './components/TodoListComponent/TodoListComponent';
import {useEffect, useState} from 'react';

function App() {
  const [sizes, setSizes] = useState(
    JSON.parse(localStorage.getItem('sizes')) || ['20%', 'auto']
  );
  localStorage.setItem('sizes', JSON.stringify(sizes));

  useEffect(() => {
    window.onresize = onResize;
    onResize();
  }, []);

  function onResize() {
    // console.log(window.innerWidth);
    if (window.innerWidth < 576) {
      setSizes(['100%', '0']);
    } else {
      setSizes(['30%', '70%']);
    }
  }
  const [isPortrait, setOrientation] = useState(
    window.screen.orientation.type.includes('portrait')
  );
  window.screen.orientation.onchange = e => {
    setOrientation(e.target.type.includes('portrait'));
  };
  console.log(window.innerWidth, isPortrait);
  //portrait//вертикальне
  //landscape//горизонтальне

  const layoutCSS = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className='App'>
      <div className='container'>
        {window.innerWidth < 576 && isPortrait ? (
          <TodoListComponent style={{...layoutCSS, background: '#ddd'}} />
        ) : (
          <SplitPane sizes={sizes} onChange={setSizes}>
            <Pane initialSize='30%' minSize='200px' maxSize='100%'>
              <TodoListComponent style={{...layoutCSS, background: '#ddd'}} />
            </Pane>
            <Pane initialSize='70%' minSize='0%' maxSize='100%'>
              <Calendar style={{...layoutCSS, background: '#ddd'}} />
            </Pane>
          </SplitPane>
        )}
      </div>
    </div>
  );
}

export default App;
