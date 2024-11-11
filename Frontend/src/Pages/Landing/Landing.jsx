import { Link } from "react-router-dom"
import Form from "../../components/Form/Form"

const Landing = () => {
  return (
    <div className="container">
      <h1 className="title">Fullstack Meetups</h1>

      <Form />
      <p className="register-text">
        Har du ingen användare? <Link to="/register">Registrera dig här</Link>
      </p>
    </div>
  )
}

export default Landing
