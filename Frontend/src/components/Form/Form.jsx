import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Form.css"

const Form = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/users/loginAccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      )

      if (!response.ok) {
        throw new Error("Felaktig e-post eller lösenord")
      }

      const data = await response.json()
      console.log("Login successful:", data)

      navigate("/portal")
    } catch (error) {
      console.error("Error during login:", error)
      setError("Inloggning misslyckades. Kontrollera dina uppgifter.")
    }
  }

  return (
    <section className="section">
      <h2 className="subtitle">Logga in</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Email"
          className="input email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          className="input password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button className="button" onClick={handleLogin}>
          Logga in
        </button>
      </div>
    </section>
  )
}

export default Form
