import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';    

import ProjectForm from './components/pages/ProjectForm.jsx';
import ViewProject from './components/pages/ViewProject.jsx';
import Manage from './components/pages/ManageProject.jsx';
import AssignManpowerPage from './components/pages/Assign.jsx';
import AddManpowerPage from './components/pages/AddManPower.jsx';
import EmployeeDashboard  from './components/pages/EmployeeDashboard.jsx';
import Client from './components/pages/Client.jsx';
import ManpowerCrud from './components/pages/ManpowerCrud.jsx';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<ProjectForm />} />
        <Route path="/view-projects" element={<ViewProject />} />
      <Route path="/manage-projects" element={<Manage />} />
<Route path="/assign" element={<AssignManpowerPage />} />
<Route path="/add" element={<AddManpowerPage />} />
<Route path="/employee" element={<EmployeeDashboard />} />
<Route path="/client" element={<Client />} />
<Route path="/manage-manpower" element={<ManpowerCrud />} />
      </Routes>
    </>
  );
}

export default App;
