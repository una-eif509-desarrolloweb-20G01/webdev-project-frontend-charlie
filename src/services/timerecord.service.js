import http from "../http-common";
import authHeader from "./auth-header";

const getAll = () => {
    return http.get(`/timeRecords`, { headers: authHeader() });
};

const get = id => {
    return http.get(`/timeRecords/${id}`, { headers: authHeader() });
};

const create = data => {
    return http.post("/timeRecords", data, { headers: authHeader() });
};

const update = (data) => {
    return http.put(`/timeRecords/`, data, { headers: authHeader() });
};

const approveByTimeSheet = (data) => {
    return http.put(`/timeRecords/timeSheet/{id}/approve`, data, { headers: authHeader() });
};

const paidByTimeSheet = (data) => {
    return http.put(`/timeRecords/timeSheet/{id}/paid`, data, { headers: authHeader() });
};

const remove = id => {
    return http.delete(`/timeRecords/${id}`, { headers: authHeader() });
};


export default {
    getAll,
    get,
    create,
    update,
    remove,
    approveByTimeSheet,
    paidByTimeSheet
};