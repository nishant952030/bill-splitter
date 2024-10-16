
import './App.css';
import Navbar from './pages/shared/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Outlet />
      <Toaster/>
    </div>
  );
}

export default App;

