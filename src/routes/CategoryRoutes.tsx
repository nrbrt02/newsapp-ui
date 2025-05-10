import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryList from '../features/categories/CategoryList';
import CreateCategory from '../features/categories/CreateCategory';
import UpdateCategory from '../features/categories/UpdateCategory';
import CategoryDetails from '../features/categories/CategoryDetails';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';

const CategoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoryList />} />
      <Route path="/:id" element={<CategoryDetails />} />
      
      {/* Protected routes for admin only */}
      <Route 
        path="/create" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CreateCategory />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UpdateCategory />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default CategoryRoutes;