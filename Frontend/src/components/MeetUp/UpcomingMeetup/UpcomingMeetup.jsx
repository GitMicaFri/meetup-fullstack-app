import React from "react"
import "./UpcomingMeetup.css"

const UpcomingMeetup = ({
  title,
  date,
  location,
  description,
  meetupId,
  userId,
  onRegister,
}) => {
  const handleRegister = async (meetupId) => {
    const userId = localStorage.getItem("userId") // Hämta userId från localStorage

    if (!userId) {
      console.error("User ID not found in localStorage")
      return
    }

    try {
      const response = await fetch(
        `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups/${meetupId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetupId: meetupId, // Se till att meetupId skickas korrekt
            userId: userId, // Se till att userId skickas korrekt
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Anmälan misslyckades")
      }

      console.log("Anmälan lyckades!")
    } catch (error) {
      console.error("Fel vid anmälan:", error)
    }
  }

  return (
    <div className="upcoming-meetup">
      <h3>{title}</h3>
      <p>Datum: {date}</p>
      <p>Plats: {location}</p>
      <p>Beskrivning: {description}</p>
      <button className="register-btn" onClick={handleRegister}>
        Anmäl dig
      </button>
    </div>
  )
}

export default UpcomingMeetup
