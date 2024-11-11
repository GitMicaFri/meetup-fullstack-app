import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./MeetupDetails.css"

const MeetupDetails = () => {
  const navigate = useNavigate()
  const { meetupId } = useParams()
  const [meetup, setMeetup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMeetupDetails = async () => {
      try {
        const response = await fetch(
          `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups/${meetupId}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch meetup details")
        }

        setMeetup(data)
      } catch (error) {
        console.error("Error fetching meetup details:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetupDetails()
  }, [meetupId])

  if (loading) {
    return <p>Laddar meetup-information...</p>
  }

  if (error) {
    return <p>{`Kunde inte hämta detaljer för denna meetup: ${error}`}</p>
  }

  if (!meetup) {
    return <p>Kunde inte hämta detaljer för denna meetup.</p>
  }

  return (
    <div className="meetup-details">
      <h2>{`Detaljer för meetup: ${meetupId}`}</h2>
      <p>
        <strong>Beskrivning:</strong> {meetup.description}
      </p>
      <p>
        <strong>Datum:</strong> {meetup.date}
      </p>
      <p>
        <strong>Plats:</strong> {meetup.location}
      </p>
      <p>
        <strong>Kapacitet:</strong> {meetup.capacity}
      </p>
      <p>
        <strong>Antal anmälda:</strong> {meetup.registered}
      </p>
      <p>
        <strong>Antal lediga platser:</strong> {meetup.availableSeats}
      </p>
      <button className="back-button" onClick={() => navigate("/portal")}>
        Tillbaka
      </button>
    </div>
  )
}

export default MeetupDetails
