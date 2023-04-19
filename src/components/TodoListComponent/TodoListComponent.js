import InputTodoGroups from "./InputTodoGroups/InputTodoGroups";
import TodoList from "../TodoList/TodoList";
import "./TodoListComponent.scss";

function TodoListComponent() {

	return (
		<div className="TodoListComponent">
			<InputTodoGroups />
			<TodoList />
		</div>
	);
}
export default TodoListComponent;
