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
import {db} from '../firebase';
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

//--------------GROUP--------------------------
export const addNewGroup = async (id, title2) => {
  await setDoc(doc(db, 'users', user.uid, 'groups', id), {
    title: title2,
  });
};

export const getGroups = async () => {
  console.log(user);
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

//--------------TODO--------------------------
function initSnapshot(q, dispatch) {
  let idTIMER;
  return onSnapshot(q, {includeMetadataChanges: true}, snapshot => {
    snapshot.docChanges().forEach(change => {
      //console.log(change.type);
      let todo = change.doc.data();
      if (change.type === 'added') {
        dispatch({type: ADD_TODOS, payload: {todo: todo}});
      }
      if (change.type === 'removed') {
        dispatch({type: DELETE_TODOS, payload: {todo: todo}});
      }
      if (change.type === 'modified') {
        dispatch({type: MODIFIED_TODOS, payload: {todo: todo}});
      }
      clearInterval(idTIMER);
      idTIMER = setTimeout(() => {
        if (todo.title?.length < 2) {
          completeRemoval(todo);
        }
      }, 10000);

      //const source = snapshot.metadata.fromCache ? 'local cache' : 'server';
      //console.log('Data came from ' + source);
    });
  });
}

export const addTodos = async dispatch => {
  let days = await getDays();
  for (const el of days) {
    const q = query(collection(db, 'users', user.uid, 'days', el, 'todos'));
    initSnapshot(q, dispatch);
  }

  let groups = await getGroups();
  for (const el of groups) {
    const q = query(
      collection(db, 'users', user.uid, 'groups', el.id, 'todos')
    );
    initSnapshot(q, dispatch);
  }
};

export const getDays = async () => {
  let start = +new Date(localStorage.getItem('start'));
  let end = +new Date(localStorage.getItem('end'));

  console.log(start, end);
  let days = [];
  let querySnapshot = await getDocs(
    query(
      collection(db, 'users', user.uid, 'days'),
      where(documentId(), '>=', start.toString()),
      where(documentId(), '<=', end.toString())
    )
  );
  await querySnapshot.forEach(doc => days.push(doc.id));
  return days;
};

export const createTodo = async newTodo => {
  console.log(newTodo);
  newTodo.idGroup += '';
  let type = +newTodo.idGroup ? 'days' : 'groups';
  if (type == 'days' && days.find(i => +i == +newTodo.idGroup) == undefined) {
    await setDoc(doc(db, 'users', user.uid, type, newTodo.idGroup), {});
  }

  await setDoc(
    doc(db, 'users', user.uid, type, newTodo.idGroup, 'todos', newTodo.idTodo),
    {...newTodo}
  );
};

export const setTitle = async (todo, title) => {
  todo.idGroup += '';
  let type = +todo.idGroup ? 'days' : 'groups';
  console.log(todo, title);
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
  if (todo.title < 2) {
    completeRemoval(todo);
  }
};

async function completeRemoval(todo) {
  let type = +todo.idGroup ? 'days' : 'groups';
  await updateDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo),
    {
      idGroup: deleteField(),
      idTodo: deleteField(),
      title: deleteField(),
      isChecked: deleteField(),
      isDeleted: deleteField(),
      key: deleteField(),
    }
  );

  await deleteDoc(
    doc(db, 'users', user.uid, type, todo.idGroup, 'todos', todo.idTodo)
  );
}

export const moveTodo = async (idTodo, targetContainerID, todos) => {
  console.log(idTodo);
  let todo = todos.find(i => i.idTodo == idTodo);
  console.log(todo, targetContainerID);
  await completeRemoval(todo);
  todo.idGroup = targetContainerID;
  await createTodo(todo);
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
