import { useNavigate } from "react-router-dom"
import "./Meetup.css"

const Meetup = () => {
    const navigate = useNavigate()




        return(
            <>
                <div class="topnav">
                    <h1 className="Rubrik">Mina Sidor</h1>
                    <input
                    type="text"
                    placeholder="Sök nya meetups..."
                    />
                    <button type="submit"><i classname="search"></i>Sök</button>

                </div>

                <div className="Meetcontainer">
                <h1 className="name">Mina Meetups</h1>
                </div>
            </>
        )
}

export default Meetup;
