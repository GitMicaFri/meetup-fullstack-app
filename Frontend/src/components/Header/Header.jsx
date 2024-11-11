import "./Header.css"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Fullstack meetups</h1>
      </div>
      <nav className="nav-menu">
        <Link to="/meetups">Meetups</Link>
        <Link to="/portal">Min profil</Link>
        <Link to="/logout">Logga ut</Link>
      </nav>
    </header>
  )
}

export default Header
