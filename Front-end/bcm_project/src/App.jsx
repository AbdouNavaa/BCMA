import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login'
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './components/Home/Home';
import PrimarySearchAppBar from './utility/AppBar';


function App() {

  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Add other routes here */}
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
