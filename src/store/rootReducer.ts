import { combineReducers } from '@reduxjs/toolkit';
// Import reducers here
import authReducer from '../features/auth/authSlice';
import articlesReducer from '../features/articles/articlesSlice';

// We'll add these reducers as we create them
export const rootReducer = combineReducers({
  auth: authReducer,
  articles: articlesReducer,
});