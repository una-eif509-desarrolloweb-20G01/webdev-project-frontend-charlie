export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user.headers'));

    if (user && user.authorization) {
        return { Authorization: user.authorization };
    } else {
        return {Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNDI4NTk1NX0.VnhOKrljo-MkW5rUEuiWR3r83LSeRqnwe2wU_hoH6TU03LRvUtRQWJObv35R5UvKTVZDblLhuE_PkmeQ_zDx3A"};
    }
}