import { useState, useEffect } from "react"
import UpcomingMeetup from "../../components/MeetUp/UpcomingMeetup/UpcomingMeetup"
import BookedMeetup from "../../components/MeetUp/BookedMetup/BookedMetup"
import "./portal.css"

const Portal = () => {
  const [bookedMeetups, setBookedMeetups] = useState([])
  const [upcomingMeetups, setUpcomingMeetups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeetupsData = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        console.error("User ID not found")
        setLoading(false)
        return
      }

      try {
        const bookedResponse = await fetch(
          `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/users/profile?userId=${userId}`
        )
        const upcomingResponse = await fetch(
          `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups`
        )

        const bookedData = await bookedResponse.json()
        const upcomingData = await upcomingResponse.json()

        if (!bookedResponse.ok || !upcomingResponse.ok) {
          throw new Error(
            bookedData.error || upcomingData.error || "Failed to fetch meetups"
          )
        }

        setBookedMeetups(bookedData.meetups)
        setUpcomingMeetups(upcomingData.meetups)
      } catch (error) {
        console.error("Error fetching meetups data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetupsData()
  }, [])

  const handleRegister = async (meetupId) => {
    const userId = localStorage.getItem("userId")
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
          body: JSON.stringify({ meetupId, userId }),
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

  const handleCancelSuccess = (meetupId) => {
    setBookedMeetups((prevMeetups) =>
      prevMeetups.filter((meetup) => meetup.id !== meetupId)
    )
  }

  return (
    <main>
      <div className="Meetcontainer">
        <h2>Mina bokade meetups</h2>
        {loading ? (
          <p>Laddar bokade meetups...</p>
        ) : bookedMeetups.length > 0 ? (
          bookedMeetups.map((meetup) => (
            <BookedMeetup
              key={meetup.id}
              meetupId={meetup.id}
              title={meetup.title}
              date={meetup.date}
              location={meetup.location}
              description={meetup.description}
              userId={localStorage.getItem("userId")}
              onCancelSuccess={handleCancelSuccess} // Använd callback för att uppdatera listan
            />
          ))
        ) : (
          <p>Inga bokade meetups hittades.</p>
        )}
      </div>

      <div className="Meetcontainer">
        <h2>Kommande meetups</h2>
        {loading ? (
          <p>Laddar kommande meetups...</p>
        ) : (
          upcomingMeetups.map((meetup) => (
            <UpcomingMeetup
              key={meetup.id}
              meetupId={meetup.id}
              title={meetup.title}
              date={meetup.scheduleDate}
              location={meetup.location}
              description={meetup.description}
              onRegister={() => handleRegister(meetup.id)}
            />
          ))
        )}
      </div>
    </main>
  )
}

export default Portal
