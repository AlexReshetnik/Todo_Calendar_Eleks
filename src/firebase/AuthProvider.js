import {useEffect, useState} from 'react';
import {app, googleAuthProvider} from './firebase';
import {getAuth, signInWithPopup, signInWithRedirect} from 'firebase/auth';
import {init} from './a';
import {useDispatch, useSelector} from 'react-redux';
import {USER_AUTH} from '../store/user/types';
import {setGroups} from '../store/groups/actions';
import {addTodos} from '../store/todos/actions';

export const AuthProvider = ({children}) => {
  const dispatch = useDispatch();
  const start = useSelector(state => state.user.start);
  const end = useSelector(state => state.user.end);
  const isAuth = useSelector(state => state.user.isAuth);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(maybeUser => {
      if (maybeUser != null) {
        return setUser(maybeUser);
      } else {
        fffff();

        //  .cath(err => console.log(err));
      }
    });
    return unsub;
  }, [auth]);

  async function fffff(params) {
    const credential = await GoogleAuthProvider.credential(
      googleUser.getAuthResponse().id_token
    );
    const result = await signInWithCredential(auth, credential);

    setUser(result);
  }

  useEffect(() => {
    if (!user) return;
    let isLogIn = init(user);
    if (isLogIn) {
      dispatch({type: USER_AUTH});
      dispatch(setGroups());
      dispatch(addTodos(start, end));
    }
  }, [user]);
  useEffect(() => {
    if (isAuth) dispatch(addTodos(start, end));
  }, [start, end]);

  return user != null ? children : <>not authorized</>;
};
