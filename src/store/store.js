import { createStore, combineReducers,applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import groupsReducer from "./groups/reducer";
import todosReducer from "./todos/reducer";
import userReducer from "./user/reducer";


const rootReducer = combineReducers({
	groups: groupsReducer,
	todos: todosReducer,
	user:userReducer
});

export const store = createStore(rootReducer,applyMiddleware(thunk));
