import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';

const DashboardPage = lazy(() => import('../features/dashboard/Dashboard'));
const ArticleList = lazy(() => import('../features/articles/ArticleList'));
const ArticleEditor = lazy(() => import('../features/articles/ArticleEditor'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const CategoryList = lazy(() => import('../features/categories/CategoryList'));
const TagList = lazy(() => import('../features/tags/TagList'));
const UserList = lazy(() => import('../features/users/UserList'));
const UserDetails = lazy(() => import('../features/users/UserDetails'));
const UserCreate = lazy(() => import('../features/users/UserCreate'));
const UserEdit = lazy(() => import('../features/users/UserEdit'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </Suspense>
        } />
        
        {/* Articles routes */}
        <Route path="articles"></Route>

        // src/routes/AdminRoutes.tsx (continued)
        <Route path="articles">
          <Route index element={
            <Suspense fallback={<div>Loading...</div>}>
              <ArticleList />
            </Suspense>
          } />
          
          <Route path="create" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WRITER]}>
                <ArticleEditor />
              </ProtectedRoute>
            </Suspense>
          } />
          
          <Route path="edit/:id" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WRITER]}>
                <ArticleEditor />
              </ProtectedRoute>
            </Suspense>
          } />
        </Route>
        
        {/* Categories routes */}
        <Route path="categories">
          <Route index element={
            <Suspense fallback={<div>Loading...</div>}>
              <CategoryList />
            </Suspense>
          } />
        </Route>
        
        {/* Tags routes */}
        <Route path="tags">
          <Route index element={
            <Suspense fallback={<div>Loading...</div>}>
              <TagList />
            </Suspense>
          } />
        </Route>
        
        {/* Users routes */}
        <Route path="users">
          <Route index element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserList />
              </ProtectedRoute>
            </Suspense>
          } />
          
          <Route path=":id" element={
            <Suspense fallback={<div>Loading...</div>}>
              <UserDetails />
            </Suspense>
          } />
          
          <Route path="create" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserCreate />
              </ProtectedRoute>
            </Suspense>
          } />
          
          <Route path="edit/:id" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserEdit />
              </ProtectedRoute>
            </Suspense>
          } />
        </Route>
        
        {/* Profile route */}
        <Route path="profile" element={
          <Suspense fallback={<div>Loading...</div>}>
            <ProfilePage />
          </Suspense>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;