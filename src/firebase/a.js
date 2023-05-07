import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  documentId,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {db} from './firebase';
import {DELETE_TODOS, MODIFIED_TODOS, ADD_TODOS} from '../store/todos/types';

let user;
let days = [];
export const init = async currentUser => {
  console.log('init', currentUser.uid);
  user = currentUser;
  let ref = await getDoc(doc(db, 'users', currentUser.uid));
  if (!ref.data()) {
    await setDoc(doc(db, 'users', user.uid), {});
    await setDoc(doc(db, 'users', user.uid, 'days'), {});
    await setDoc(doc(db, 'users', user.uid, 'groups'), {});
  }
  return true;
};

//--------------GROUP-------------------------

export const addNewGroup = async (id, title2, dispatch) => {
  await setDoc(doc(db, 'users', user.uid, 'groups', id), {
    title: title2,
  });
  const q = query(collection(db, 'users', user.uid, 'groups', id, 'todos'));
  initSnapshot(q, dispatch);
};

export const getGroups = async () => {
  let querySnapshot = await getDocs(
    collection(db, 'users', user.uid, 'groups')
  );
  let arr = [];
  await querySnapshot.forEach(doc => {
    arr.push({id: doc.id, title: doc.data().title});
  });
  return arr;
};

export const deleteGroup = async id => {
  await updateDoc(doc(db, 'users', user.uid, 'groups', id), {
    title: deleteField(),
  });

  await deleteDoc(doc(db, 'users', user.uid, 'groups', id));
};

export const setCurrentGroup = async id => {
  if (id) {
    await setDoc(doc(db, 'users', user.uid), {
      currentGroupID: id,
    });
  } else {
    let ref = await getDoc(doc(db, 'users', user.uid));
    return ref.data().currentGroupID;
  }
  return id;
};

function clear(todo) {
  if (todo.title?.length < 2) {
    console.log('clear----------------', todo.idTodo);
    completeRemoval(todo);
  }
}
let timerId = {};

//--------------TODO--------------------------
function initSnapshot(q, dispatch, idGroup) {
  return onSnapshot(q, {includeMetadataChanges: true}, snapshot => {
    snapshot.docChanges().forEach(change => {
      let todo = change.doc.data();
      console.log(change.type, todo.idTodo);
     /* if (todo.idTodo === undefined) {
        setTimeout(() => {
          completeRemoval({idGroup: idGroup, idTodo: change.doc.id});
        }, 0);
        return;
      }*/
      if (change.type === 'added' && todo.idTodo) {
        dispatch({type: ADD_TODOS, payload: {todo: todo}});
      }
      if (change.type === 'removed') {
        dispatch({
          type: DELETE_TODOS,
          payload: {todo: {idTodo: change.doc.id}},
        });
      }
      if (change.type === 'modified') {
        dispatch({type: MODIFIED_TODOS, payload: {todo: todo}});
      }

      if (timerId[todo.idTodo]) {
        clearTimeout(timerId[todo.idTodo]);
        timerId[todo.idTodo] = undefined;
      }

      if (!todo.title || todo.title.length < 2) {
        timerId[todo.idTodo] = setTimeout(clear, 10000, todo);
      }
      //const source = snapshot.metadata.fromCache ? 'local cache' : 'server';
      //console.log('Data came from ' + source);
    });
  });
}
async function loadTodos(dispatch, start, end) {
  let days = await getDays(start, end);
  for (const el of days) {
    const q = query(collection(db, 'users', user.uid, 'days', el, 'todos'));
    initSnapshot(q, dispatch, el);
  }
}
async function loadGroups(dispatch, params) {
  let groups = await getGroups();
  for (const el of groups) {
    const q = query(
      collection(db, 'users', user.uid, 'groups', el.id, 'todos')
    );
    initSnapshot(q, dispatch, el.id);
  }
}

export const addTodos = async (dispatch, start, end) => {
  await loadTodos(dispatch, start, end);
  await loadGroups(dispatch);

  let now = document.querySelector('.now');
  if (now) {
    document.querySelector('.Calendar').scrollTo({
      top: now.offsetTop,
      behavior: 'instant',
    });
  }
};

export const getDays = async (start, end) => {
  let days = [];
  let querySnapshot = await getDocs(
    query(
      collection(db, 'users', user.uid, 'days'),
      where(documentId(), '>=', +start + ''),
      where(documentId(), '<=', +end + '')
    )
  );
  await querySnapshot.forEach(doc => days.push(doc.id));
  return days;
};

export const createTodo = async newTodo => {
  let type = +newTodo.idGroup ? 'days' : 'groups';
  newTodo.idGroup += '';
  /* if (type === 'days' && days.find(i => +i == +newTodo.idGroup) == undefined) {
    await setDoc(doc(db, 'users', user.uid, type, newTodo.idGroup), {});
  }*/

  await setDoc(
    doc(db, 'users', user.uid, type, newTodo.idGroup, 'todos', newTodo.idTodo),
    newTodo
  );
};

export const setTitle = async (todo, title) => {
  console.log(todo.idTodo, '----', title);
  todo.idGroup += '';
  let type = +todo.idGroup ? 'days' : 'groups';
  await updateDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo),
    {
      title: title,
    }
  );
};

export const deteleTodo = async todo => {
  let type = +todo.idGroup ? 'days' : 'groups';
  await updateDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo),
    {
      isDeleted: true,
    }
  );
  if (todo.title.length < 2) {
    completeRemoval(todo);
  }
};

async function completeRemoval(todo) {
  let type = +todo.idGroup ? 'days' : 'groups';
  /*await updateDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo),
    {
      idGroup: deleteField(),
      idTodo: deleteField(),
      title: deleteField(),
      isChecked: deleteField(),
      isDeleted: deleteField(),
      key: deleteField(),
      chosen: deleteField(),
    }
  );*/

  await deleteDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo)
  );
}

export const moveTodo = async (todo, targetContainerID) => {
  await completeRemoval(todo);
  await createTodo({...todo, idGroup: targetContainerID});
};

export const sortTodo = async sortList => {
  let type = +sortList[0].idGroup ? 'days' : 'groups';
  sortList.forEach(async el => {
    try {
      await updateDoc(
        doc(db, 'users', user.uid, type, el.idGroup, 'todos', el.idTodo),
        {
          key: el.key,
        }
      );
    } catch {}
  });
};
