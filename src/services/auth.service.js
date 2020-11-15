import http from "../http-common";
import authHeader from "./auth-header";
const signup = data => {
    return http.post('/users/sign-up', data);
};

const login = data => {
    return http
        .post('/login', data)
        .then((response) => {
            if (response.headers.authorization) {
                localStorage.setItem("user.headers", JSON.stringify(response.headers));
                localStorage.setItem("user.data", JSON.stringify(response.data));
            }
            return loadCurrentUser(data.username);
        });
};

const loadCurrentUser = username => {
    return http.get(`/users/username/${username}`, { headers: authHeader() })
        .then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        }).catch(err => {
            console.log(err);
        });
};

const logout = () => {
    localStorage.removeItem("user.headers");
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const isAdminUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        const result = user.roleList.find(e => { return e.name == "ROLE_ADMIN" }) != null;
        console.log(result);
        return result;
    }
    return false;
};

const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem("user.headers")) ? true : false;
};


export default {
    signup,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    isAdminUser
};