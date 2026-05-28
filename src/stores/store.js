import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
  user: null,
  token: null,
  permissions: [],
  loading: false,
  sidebarCollapsed: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
