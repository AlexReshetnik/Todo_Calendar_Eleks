import {useEffect, useState} from 'react';
import {app, googleAuthProvider} from './firebase';
import {getAuth, signInWithPopup} from 'firebase/auth';
import {init} from './firebase/a';
import {useDispatch} from 'react-redux';
import {USER_AUTH} from './store/user/types';
import {setGroups} from './store/groups/actions';
import {addTodos} from './store/todos/actions';

export const AuthProvider = ({children}) => {
  const dispatch = useDispatch();

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(maybeUser => {
      if (maybeUser != null) {
        return setUser(maybeUser);
      } else {
        signInWithPopup(auth, googleAuthProvider)
          .then(credentials => {
            console.log(credentials.user);
            setUser(credentials.user)
          })
          .cath(err => console.log(err));
      }
    });
    return unsub;
  }, [auth]);

  useEffect(() => {
   
    if (!user ) return;
    let isLogIn = init(user);
    if (isLogIn) {
      dispatch({type: USER_AUTH});
      dispatch(setGroups());
      dispatch(addTodos());
    }
  }, [user]);

  return user != null ? children : <>not authorized</>;
};
