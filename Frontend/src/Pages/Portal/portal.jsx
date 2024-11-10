import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UpcomingMeetup from "../../components/MeetUp/UpcomingMeetup/UpcomfingMeetup"
import "../Portal/portal.css"

const Portal = () => {
  const [upcomingMeetups, setUpcomingMeetups] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        const response = await fetch(
          "https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups"
        )
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av meetups")
        }
        const data = await response.json()
        setUpcomingMeetups(data.meetups)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meetups:", error)
        setLoading(false)
      }
    }

    fetchMeetups()
  }, [])

  return (
    <main>
      <div className="topnav">
        <h1 className="title">Mina Sidor</h1>
        <button className="btn" onClick={handleLogout}>
          Logga ut
        </button>
        <input type="text" placeholder="Sök nya meetups..." />
        <button className="btn" type="submit">
          Sök
        </button>
      </div>

      <div className="Meetcontainer">
        <h2>Kommande meetups</h2>
        {loading ? (
          <p>Laddar meetups...</p>
        ) : (
          upcomingMeetups.map((meetup) => (
            <UpcomingMeetup
              key={meetup.id}
              title={meetup.title}
              date={meetup.scheduleDate}
              location={meetup.location}
              description={meetup.description}
              onRegister={() =>
                console.log(`Anmäler till meetup med id ${meetup.id}`)
              }
            />
          ))
        )}
      </div>
    </main>
  )
}

export default Portal
