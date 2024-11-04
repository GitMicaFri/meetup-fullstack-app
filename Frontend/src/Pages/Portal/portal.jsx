//import { useNavigate } from "react-router-dom"
import MeetUp from "../../components/MeetUp/Meetup";
import '../Portal/portal.css';

const Portal = () => {

        return(
            <main>
                <div className="topnav">
                    <h1 className="title">Mina Sidor</h1>
                    <button className="btn">Logga ut</button>
                    <button className="delete-btn">Ta bort konto</button>

                    <input
                    type="text"
                    placeholder="Sök nya meetups..."
                    />
                    <button className="btn" type="submit">Sök</button>
                </div>

                <div className="Meetcontainer">
                    <h2>Mina bokade meetups</h2>
                    
                    <MeetUp />

                    <div>
                        <h2>Kommande meetups</h2>
                    </div>
                </div>
            </main>
        )
}

export default Portal;
