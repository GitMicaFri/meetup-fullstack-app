import "./Form.css"
import { useNavigate } from "react-router-dom"

const Form = () => {
  const navigate = useNavigate()

  function handleClick() {
    navigate("/register")
  }
  function login() {
    navigate("/portal")
  }

  return (

      <section className="section">
        <h2 className="subtitle">Logga in</h2>

        <div className="form">
          <input type="text" placeholder="Email" className="input email" />
          <input
            type="password"
            placeholder="Lösenord"
            className="input password"
          />

          <p className="register-btn" onClick={handleClick}>
            Inget konto? Registrera dig här!
          </p>

          <button className="button" onClick={login}>Logga in</button>
        </div>
      </section>
  )
}

export default Form
