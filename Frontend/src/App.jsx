import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './components/Form/Form';
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Meetup from "./Pages/Meetup/Meetup"
import Landing from "./Pages/Landing/Landing"

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/form" element={<Form />}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/portal" element={<Meetup />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
