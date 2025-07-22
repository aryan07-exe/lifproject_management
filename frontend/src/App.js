
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/pages/ProjectForm.jsx';
import ViewProject from './components/pages/ViewProject.jsx';
import './App.css';
import Navbar from './components/pages/Navbar.jsx';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<ProjectForm />} />
        <Route path="/view-projects" element={<ViewProject />} />
      
      </Routes></>
    
  );
}

export default App;
