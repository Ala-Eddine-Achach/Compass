import { createContext, useEffect } from "react";
import { useState } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Api/Api";

export const CurrentUser = createContext({
  currentUser: null,
  setCurrentUser: () => {},
  loading: false,
  setLoading: () => {},
});

export default function CurrentUserContext({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const cookie = Cookie();
    const userToken = cookie.get("academiqa");
    if (userToken) {
      setCurrentUser({
        id: jwtDecode(userToken).id,
        role: jwtDecode(userToken).role,
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
      });
    }
  }, []);

    useEffect(() => {
        if(currentUser){
            const userPath = currentUser.role === "Student" ? 'student' : currentUser.role === "Admin" ? 'admin' : 'teacher';
            const userToken = Cookie().get('academiqa');

      axios
        .get(`${baseURL}/${userPath}/${currentUser?.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser]);
  return (
    <CurrentUser.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading, user }}
    >
      {children}
    </CurrentUser.Provider>
  );
}
