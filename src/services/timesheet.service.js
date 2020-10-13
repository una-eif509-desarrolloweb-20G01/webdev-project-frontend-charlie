import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/timeSheets`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/timeSheets/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/timeSheets", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/timeSheets/`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/timeSheets/${id}`, { headers: authHeader() });
};


export default {
    getAll,
    get,
    create,
    update,
    remove,
};