import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import { CategoryProvider } from './context/CategoryContext';

function App() {
  return (
    <Provider store={store}>
      <CategoryProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CategoryProvider>
    </Provider>
  );
}

export default App;