import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Home from './pages/Home';
import MyPortfolioUnlink from './pages/MyPortfolioUnlink';
import MyPortfolioLink from './pages/MyPortfolioLink';
import IndividualStock from './pages/IndividualStock';
import AiAnalysis from './pages/Aianalysis';
import EmailVerification from './pages/EmailVerification'; // 새로 추가한 이메일 인증 컴포넌트
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
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/verify" element={<EmailVerification />} /> {/* 추가된 라우트 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
