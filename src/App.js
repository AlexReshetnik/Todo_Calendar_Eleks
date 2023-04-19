import "./App.scss";
import Calendar from "./components/Calendar/Calendar";
import TodoListComponent from "./components/TodoListComponent/TodoListComponent";

function App() {

  return (
    <div className='App'>
      <div className='container'>
        <TodoListComponent />
        <Calendar />
      </div>
    </div>
  );
}

export default App;
