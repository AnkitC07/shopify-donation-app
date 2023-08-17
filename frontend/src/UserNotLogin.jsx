
import { useContext, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { UserContext } from "../context/User"

const UserNotLogin = () => {
    const { user, isLoggedIn } = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (user.token && isLoggedIn === true) {
            navigate(`/`)
        }
    }, [user.loading, isLoggedIn])

    return (
        <>
            {user.loading == false ? <Outlet /> : null}
        </>
    )
}

export default UserNotLogin