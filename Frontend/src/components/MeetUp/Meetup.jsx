import { useNavigate } from 'react-router-dom';
import '../MeetUp/MeetUp.css';

const MeetUp = () => {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/register")
    }

    let maxGuest;

    return(
        <main>
            <section className="meet-box">
                <h3>Vad mötet heter</h3>
                <p>Här är en stor beskrivning av detta mötet!!</p>
                <p>Datum:</p>
                <p>Tid:</p>
                <p>Plats:</p>
                <p>Värd:</p>

                {/* If statement på knappen ifall användaren är anmäld eller ej. */}
                <button className='button-register' onClick={handleClick}>{maxGuest ? 'Fullbokat' : 'Anmäl dig här'}</button>
            </section>
        </main>
    )
}

export default MeetUp;