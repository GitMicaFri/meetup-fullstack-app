import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Form = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel vid inloggningen")
      }

      // Spara userId i localStorage
      localStorage.setItem("userId", data.userId)

      navigate("/portal")
    } catch (error) {
      setError(error.message)
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
        {error && <p className="error">{error}</p>}
        <button className="button" onClick={handleLogin}>
          Logga in
        </button>
      </div>
    </section>
  )
}

export default Form
