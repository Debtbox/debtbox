import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/debtbox' : '/'}>
      <div className="w-screen h-screen text-center items-center justify-center flex">
        <h1 className="text-4xl font-bold text-teal-900">DebtBox</h1>
      </div>
    </Router>
  );
}

export default App;
