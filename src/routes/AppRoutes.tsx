import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/Home'));
const AboutPage = lazy(() => import('../pages/About'));
const LoginPage = lazy(() => import('../features/auth/Login'));
const RegisterPage = lazy(() => import('../features/auth/Register'));
const ArticlePage = lazy(() => import('../pages/ArticlePage'));
const ArticleEditorPage = lazy(() => import('../features/articles/ArticleEditor'));
const DashboardPage = lazy(() => import('../features/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Categories feature
const CategoryList = lazy(() => import('../features/categories/CategoryList'));
const CategoryDetails = lazy(() => import('../features/categories/CategoryDetails'));
const CreateCategory = lazy(() => import('../features/categories/CreateCategory'));
const UpdateCategory = lazy(() => import('../features/categories/UpdateCategory'));

import { ROLES } from '../utils/constants';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="articles/:id" element={<ArticlePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes with AdminLayout */}
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="articles/create" element={<ArticleEditorPage />} />
          <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Categories routes */}
          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path=":id" element={<CategoryDetails />} />
            <Route 
              path="create" 
              element={
                <PrivateRoute requiredRole={[ROLES.ADMIN]}>
                  <CreateCategory />
                </PrivateRoute>
              } 
            />
            <Route 
              path="edit/:id" 
              element={
                <PrivateRoute requiredRole={[ROLES.ADMIN]}>
                  <UpdateCategory />
                </PrivateRoute>
              } 
            />
          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;