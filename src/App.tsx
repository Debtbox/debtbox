import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
