
const RegisterForm = () => {
    return(
        <div className="container">

            <div>
                <h1 className="title">Fullstack Meetups</h1>
            </div>

            <section className="section">
                <h2 className="subtitle">Registrera dig här</h2>

                <div className="form">
                    <input type="text" placeholder="Förnamn" className="input" />
                    <input type="text" placeholder="Efternamn" className="input email" />
                    <input type="text" placeholder="Email" className="input email" />
                    <input type="password" placeholder="Lösenord" className="input password" />

                    <button className="button">Registrera</button>
                </div>
            </section>
       </div>
    )
}

export default RegisterForm;