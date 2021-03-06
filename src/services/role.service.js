import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/roles`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/roles/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/roles", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/roles/`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/roles/${id}`, { headers: authHeader() });
};


export default {
    getAll,
    get,
    create,
    update,
    remove,
};