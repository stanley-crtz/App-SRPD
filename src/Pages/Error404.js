import React, {Fragment} from 'react'
import '../Assets/CSS/Error404.css'

const Error404 = () => {

    return (
        <Fragment>
            <div className="divFull"></div>
            <div className="notFound">
                <h2 className="">Pagina no encontrada</h2>
                <a className="centerA" href="/">Volver</a>
            </div>
        </Fragment>
    )
}

export default Error404