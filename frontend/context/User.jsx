import { createContext, useEffect, useState } from "react";
import { useGetToken } from "../src/hooks/setGetToken";
import { api as apiURL } from "../appConfig"

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
    const obj = useGetToken();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({
        token: obj?.token,
        loading: true,
    })


    useEffect(() => {
        const getStore = async () => {
            const req = await fetch(`${apiURL}/api/checkuser`, {
                headers: {
                    "api-token": obj?.token
                }
            })
            if (req.status == 401) {
                setUser({ ...user, loading: false });
                return false;
            }
            const res = await req.json();
            if (res.token !== null) {
                console.log('context app state')
                setLoggedIn(true);
                setUser({ ...user, loading: false, token: res.token });
            }

        }

        getStore();
    }, []);


    return (
        <UserContext.Provider value={{ isLoggedIn, setLoggedIn, user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider