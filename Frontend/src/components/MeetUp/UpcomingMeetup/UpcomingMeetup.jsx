import React from "react"
import { useNavigate } from "react-router-dom"
import "./UpcomingMeetup.css"

const UpcomingMeetup = ({
  title,
  date,
  location,
  description,
  meetupId,
  userId,
  onRegister,
  onRegisterSuccess,
}) => {
  const navigate = useNavigate()

  const handleRegister = async (meetupId) => {
    const userId = localStorage.getItem("userId")

    if (!userId) {
      console.error("User ID not found in localStorage")
      return
    }

    try {
      const requestBody = { meetupId, userId }
      console.log("Request body before stringifying:", requestBody)

      const response = await fetch(
        `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups/${meetupId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (!response.ok) {
        if (responseData.message === "User already registered") {
          alert("Du är redan anmäld till denna meetup.")
        } else {
          throw new Error(responseData.error || "Anmälan misslyckades")
        }
      } else {
        console.log("Anmälan lyckades!")

        window.location.reload()
      }
    } catch (error) {
      console.error("Fel vid anmälan:", error)
    }
  }

  const handleDetailsClick = () => {
    navigate(`/meetup/${meetupId}`)
  }

  return (
    <div className="upcoming-meetup">
      <h3>{title}</h3>
      <p>Datum: {date}</p>
      <p>Plats: {location}</p>
      <p>Beskrivning: {description}</p>
      <div className="button-container">
        <button className="details-btn" onClick={handleDetailsClick}>
          Visa detaljer
        </button>
        <button
          className="register-btn"
          onClick={() => handleRegister(meetupId)}
        >
          Anmäl dig
        </button>
      </div>
    </div>
  )
}

export default UpcomingMeetup
