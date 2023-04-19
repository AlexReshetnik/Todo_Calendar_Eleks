import { createStore, combineReducers } from "redux";

import groupsReducer from "./groups/reducer";
import todosReducer from "./todos/reducer";


const rootReducer = combineReducers({
	groups: groupsReducer,
	todos: todosReducer
});

export const store = createStore(rootReducer);
