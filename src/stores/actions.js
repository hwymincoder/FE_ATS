export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_PERMISSIONS = 'SET_PERMISSIONS';
export const SET_LOADING = 'SET_LOADING';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const LOGOUT = 'LOGOUT';

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const setPermissions = (permissions) => ({ type: SET_PERMISSIONS, payload: permissions });
export const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
export const toggleSidebar = () => ({ type: TOGGLE_SIDEBAR });
export const logout = () => ({ type: LOGOUT });
