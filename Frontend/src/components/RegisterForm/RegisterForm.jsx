import { useNavigate } from "react-router-dom";


const RegisterForm = () => {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/portal")
  }

  return (
    <div className="container">
      <div>
        <h1 className="title">Fullstack Meetups</h1>
      </div>

      <section className="section">
        <h2 className="subtitle">Registrera dig här</h2>

        <div className="form">
          <input type="text" placeholder="Förnamn" className="input" />
          <input type="text" placeholder="Efternamn" className="input email" />
          <input type="text" placeholder="Email" className="input email" />
          {/* if statement ifall användaren ska anmäla sig till möte eller registrera ett konto
          isåfall ska lösenord inputen ej synas. */}
          <input
            type="password"
            placeholder="Lösenord"
            className="input password"
          />

          <button className="button" onClick={handleClick}>Registrera</button>
        </div>
      </section>
    </div>
  )
}

export default RegisterForm;
