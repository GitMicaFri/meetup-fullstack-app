import { useState, useEffect } from "react"
import BookedMeetup from "../../components/MeetUp/BookedMetup/BookedMetup"
import "../Portal/portal.css"

const Portal = () => {
  const [bookedMeetups, setBookedMeetups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookedMeetups = async () => {
      const userId = localStorage.getItem("userId") // Hämta userId från localStorage
      if (!userId) {
        console.error("User ID not found")
        return
      }

      try {
        const response = await fetch(
          `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/users/profile?userId=${userId}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || "Något gick fel vid hämtning av meetups"
          )
        }

        setBookedMeetups(data.meetups)
        setLoading(false)
      } catch (error) {
        console.error("Fel vid hämtning av meetups:", error)
        setLoading(false)
      }
    }

    fetchBookedMeetups()
  }, [])

  return (
    <main>
      <div className="Meetcontainer">
        <h2>Mina bokade meetups</h2>
        {loading ? (
          <p>Laddar meetups...</p>
        ) : (
          bookedMeetups.map((meetup) => (
            <BookedMeetup key={meetup.id} {...meetup} />
          ))
        )}
      </div>
    </main>
  )
}

export default Portal
