import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });

  //default axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth?.token}`;

  useEffect(() => {
    const loadAuth = async () => {
      const data = await AsyncStorage.getItem('auth');
      if (data) {
        const parseData = JSON.parse(data);
        setAuth({
          ...auth,
          user: parseData.user,
          token: parseData.token,
        });
      }
    };
    loadAuth();
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
//custom hook
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
