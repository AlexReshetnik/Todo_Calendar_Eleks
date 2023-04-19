import { SET_CURRENT_GROUP_ID, CREATE_GROUP, DELETE_GROUP } from "./types";
import { v4 as uuid } from 'uuid';

// variables
const USER_DATA_KEY = "GROUPS"; // name of localStorage key
let LSdata = localStorage.getItem(USER_DATA_KEY);

let currentGroupID = uuid()
let initialState =
	LSdata !== null
		? JSON.parse(LSdata)
		: {
			currentGroupID: currentGroupID,
			groups: [
				{ id: currentGroupID, title: "Ten" },
			]
		};

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_GROUP_ID:
			console.log(SET_CURRENT_GROUP_ID);
			state = { ...state, currentGroupID: action.payload.groupID };

			break;
		case CREATE_GROUP:
			let currentGroupIDnew = uuid()

			state = {
				...state,
				currentGroupID: currentGroupIDnew,
				groups: [...state.groups, { title: action.payload.title, id: currentGroupIDnew }]
			};
			break;

		case DELETE_GROUP:
			state = {
				...state,
				groups: [...state.groups.filter(i => i.id !== action.payload.deleteID)],
				currentGroupID:
					state.currentGroupID === action.payload.deleteID ? null : state.currentGroupID
			};

			break;
	}
	localStorage.setItem(USER_DATA_KEY, JSON.stringify(state));
	state.groups = state.groups.slice();
	return state;
};

export default groupsReducer;
