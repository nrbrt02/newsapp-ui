import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import { CategoryProvider } from './context/CategoryContext';
import { TagProvider } from './context/TagContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <CategoryProvider>
          <TagProvider>
            <Router>
              <AppRoutes />
            </Router>
          </TagProvider>
        </CategoryProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;