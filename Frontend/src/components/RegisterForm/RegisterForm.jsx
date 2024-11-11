import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../Form/Form.css"

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        "https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/users/createAccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error("Registrering misslyckades. Försök igen.")
      }

      const data = await response.json()
      console.log("Registrering lyckades:", data)

      // Navigera användaren till portalen efter lyckad registrering
      navigate("/portal")
    } catch (error) {
      console.error("Error registering user:", error)
      setError(
        "Registreringen misslyckades. Kontrollera din information och försök igen."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div>
        <h1 className="title">Fullstack Meetups</h1>
      </div>

      <section className="section">
        <h2 className="subtitle">Registrera dig här</h2>

        <div className="form">
          <input
            type="text"
            name="firstName"
            placeholder="Förnamn"
            className="input"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Efternamn"
            className="input"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            className="input password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Registrerar..." : "Registrera"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default RegisterForm
