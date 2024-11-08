import "./UpcomfingMeetup.css"

const UpcomingMeetup = ({ title, date, location, description, onRegister }) => {
  return (
    <div className="meetup-box">
      <h3 className="meetup-title">{title}</h3>
      <p>
        <strong>Datum: {date}</strong>
      </p>
      <p>
        <strong>Plats: {location} </strong>
      </p>
      <p>
        <strong>Beskrivning: {description}</strong>
      </p>
      <button className="register-btn" onClick={onRegister}>
        Anmäl dig här
      </button>
    </div>
  )
}

export default UpcomingMeetup
