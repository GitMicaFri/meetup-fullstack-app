import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './components/Form/Form';
import RegisterForm from "./components/RegisterForm/RegisterForm";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />}/>
        <Route path="/form" element={<Form />}/>
        <Route path="/register" element={<RegisterForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
