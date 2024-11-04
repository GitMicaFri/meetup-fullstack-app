//import { useNavigate } from "react-router-dom"
import "./Meetup.css"

const Meetup = () => {
    //const navigate = useNavigate()

        return(
            <main>
                <div className="topnav">
                    <h1 className="title">Mina Sidor</h1>
                    <input
                    type="text"
                    placeholder="Sök nya meetups..."
                    />
                    <button className="btn" type="submit">Sök</button>
                </div>

                <div className="Meetcontainer">
                    <h1 className="subtitle">Mina Meetups</h1>
                </div>
            </main>
        )
}

export default Meetup;
