import "./Form.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Form = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

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
        throw new Error("Inloggningen misslyckades")
      }

      const data = await response.json()
      // Spara token i localStorage
      localStorage.setItem("authToken", data.token)
      navigate("/portal")
    } catch (error) {
      console.error("Error during login:", error)
      alert("Fel vid inloggning, vänligen kontrollera dina uppgifter.")
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
        <button className="button" onClick={handleLogin}>
          Logga in
        </button>
      </div>
    </section>
  )
}

export default Form
