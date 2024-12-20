import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Form from "./components/Form/Form"
import RegisterForm from "./components/RegisterForm/RegisterForm"
import Landing from "./Pages/Landing/Landing"
import Portal from "./Pages/Portal/portal"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import MeetupDetails from "./components/MeetUp/MeetupDetails/MeetupDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<Form />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <Portal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetup/:meetupId"
          element={
            <ProtectedRoute>
              <MeetupDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
