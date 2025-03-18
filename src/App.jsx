import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Home from './pages/Home';
import MyPortfolioUnlink from './pages/MyPortfolioUnlink';
import MyPortfolioLink from './pages/MyPortfolioLink';
import IndividualStock from './pages/IndividualStock';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<MyPortfolioUnlink />} />
          <Route path="/portfolio/link" element={<MyPortfolioLink />} />
          <Route path="/stock/:symbol" element={<IndividualStock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;