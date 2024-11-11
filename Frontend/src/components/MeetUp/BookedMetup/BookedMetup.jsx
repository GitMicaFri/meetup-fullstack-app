import { useState } from "react"
import "./BookedMetup.css"

const BookedMeetup = ({
  title,
  date,
  location,
  description,
  meetupId,
  userId,
  onCancelSuccess,
}) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState(null)

  const handleCancel = async () => {
    setIsCancelling(true)
    setError(null)

    try {
      const response = await fetch(
        "https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups/cancel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetupId, userId }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to cancel the meetup. Please try again.")
      }

      const data = await response.json()
      console.log("Cancellation successful:", data)
      onCancelSuccess(meetupId) // Callback för att uppdatera listan efter avbokning
    } catch (error) {
      console.error("Error cancelling meetup:", error)
      setError("Ett fel uppstod vid avbokning. Försök igen.")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="booked-meetup-box">
      <h3>{title}</h3>
      <p>Datum: {date}</p>
      <p>Plats: {location}</p>
      <p>Beskrivning: {description}</p>
      <button
        className="cancel-btn"
        onClick={handleCancel}
        disabled={isCancelling}
      >
        {isCancelling ? "Avbokar..." : "Avboka meetup"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default BookedMeetup
