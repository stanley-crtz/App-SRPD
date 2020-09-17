import React, { useState } from 'react'
import Axios from 'axios'
import Global from '../Global'
import Swal from 'sweetalert2'

const RecuperarCuenta = () => {

    const [Usuario, setUsuario] = useState('')

    const sendUsuario = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Enviando Correo...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });

        Axios.post(Global.servidor + 'forgetPassword', {User: Usuario})
            .then((resp) => {
                Swal.fire('Correo enviado', 'Se ha proporcionado un enlace de recuperación a su correo','success')
            })
            .catch((err) => {
                Swal.fire('Error', 'Intentelo más tarde', 'error');
            })
    }

    return(
        <main className="main margin-50">

            <section className="content-form-denegado">
                <h2 className="sub-title line-bottom">RECUPERA TU CUENTA</h2>
                
                <form className="text-left full-form" id="frmUser" method="get" onSubmit={sendUsuario}>
                    
                    <p>Ingresa tu usuario para buscar tu cuenta</p> 

                    <div className="from-control">
                        <input type="text" className="form-control" placeholder="Usuario" onChange={(e) => setUsuario(e.target.value)}/>
                        
                        <div className="loginButton">
                            <input type="submit" className="form-control btn-success" value="Enviar"/>
                        </div>
                    </div>
                </form>
        
            </section>
        </main>
    )
}

export default RecuperarCuenta