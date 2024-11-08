import "./BookedMeetup.css"

const BookedMeetup = ({ title, date, location, description, attendees }) => {
  return (
    <div className="meetup-box">
      <h3>{title}</h3>
      <p>Datum: {date}</p>
      <p>Plats: {location}</p>
      <p>Beskrivning: {description}</p>
      <p>Anmälda: {attendees}</p>
      <button className="cancel-btn" onClick={onCancel}>
        Avboka meetup
      </button>
    </div>
  )
}

export default BookedMeetup
