import React from 'react'
import imgDenegado from '../Assets/Images/gif/denegado.gif'

const NotAccess = () => {

    return(
        <main role="main">

            <section className="content-form-denegado">
                <h2 className="sub-title line-bottom">ALERTA</h2>
                
                <form id="frmUser" method="get"> 
                    <img src={imgDenegado} alt="Denegado"/>
                </form>

                <h2 className="sub-title line-bottom">_</h2>

            </section>
        </main>
    )

}

export default NotAccess