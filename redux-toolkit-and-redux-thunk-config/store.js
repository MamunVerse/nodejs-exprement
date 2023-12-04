import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import authReducer from './authSlice';
import blogReducer from './blogSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    user: userReducer,
    product: productReducer,
  },
  middleware: [thunkMiddleware],
});

export default store;
