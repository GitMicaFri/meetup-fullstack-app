import { useState, useEffect } from "react"
import UpcomingMeetup from "../../components/MeetUp/UpcomingMeetup/UpcomingMeetup"
import BookedMeetup from "../../components/MeetUp/BookedMetup/BookedMetup"
import "./portal.css"

const Portal = () => {
  const [bookedMeetups, setBookedMeetups] = useState([])
  const [upcomingMeetups, setUpcomingMeetups] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId")

      if (!userId) {
        console.error("User ID not found")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/users/profile?userId=${userId}`
        )
        const profileData = await response.json()

        console.log("Profile data fetched: ", profileData)

        if (response.ok && profileData) {
          setUserProfile({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
          })
        } else {
          console.error("Failed to fetch user profile: ", profileData.error)
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error)
      }
    }

    fetchUserProfile()

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

  // Funktion för att hantera avbokning
  const handleCancelSuccess = (cancelledMeetupId) => {
    setBookedMeetups((prevMeetups) =>
      prevMeetups.filter((meetup) => meetup.id !== cancelledMeetupId)
    )
  }

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(
        `https://pe1klf35h9.execute-api.eu-north-1.amazonaws.com/dev/meetups/search?keyword=${encodeURIComponent(
          query
        )}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sökningen misslyckades")
      }

      setSearchResults(data.meetups)
    } catch (error) {
      console.error("Fel vid sökning av meetups:", error)
      setSearchResults([])
    }
  }

  const handleRegisterSuccess = (newMeetup) => {
    setBookedMeetups((prevMeetups) => [...prevMeetups, newMeetup])
  }

  return (
    <main>
      {userProfile && (
        <div className="profile-container">
          <h2>
            Välkommen, {userProfile.firstName} {userProfile.lastName}!
          </h2>
          <p>Email: {userProfile.email}</p>
        </div>
      )}
      <div className="search-container">
        <input
          type="text"
          placeholder="Sök efter meetups..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

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
              onCancelSuccess={handleCancelSuccess}
            />
          ))
        ) : (
          <p>Inga bokade meetups hittades.</p>
        )}
      </div>

      <div className="Meetcontainer">
        <h2>Sökresultat</h2>
        {searchResults.length > 0 ? (
          searchResults.map((meetup) => (
            <UpcomingMeetup
              key={meetup.id}
              meetupId={meetup.id}
              title={meetup.title}
              date={meetup.scheduleDate}
              location={meetup.location}
              description={meetup.description}
              onRegisterSuccess={handleRegisterSuccess}
            />
          ))
        ) : (
          <p>Inga resultat för din sökning.</p>
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
            />
          ))
        )}
      </div>
    </main>
  )
}

export default Portal
