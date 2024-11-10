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
        // Kontrollera om meddelandet är "User already registered" och hantera det.
        if (responseData.message === "User already registered") {
          alert("Du är redan anmäld till denna meetup.")
        } else {
          throw new Error(responseData.error || "Anmälan misslyckades")
        }
      } else {
        console.log("Anmälan lyckades!")
      }
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
      <button className="register-btn" onClick={() => handleRegister(meetupId)}>
        Anmäl dig
      </button>
    </div>
  )
}

export default UpcomingMeetup
