import React, {Component, Fragment} from 'react'
import Editor from '../Components/Editor'
import Axios from 'axios'
import Global from '../Global'
import Swal from 'sweetalert2'
import HeaderComponent from '../Components/Header'
import { Redirect } from 'react-router-dom'
import JWT from '../Class/JWT'

export default class NewForo extends Component {

    state = {
        informacion: null,
        redirect: false
    }

    sendForo = (data) => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        } 
        Axios.put(Global.servidor + "updateForo", data, {headers})
            .then((resp) => {
                if (resp.data.status !== 'error') {
                    Swal.fire('Seccion actualizada correctamente', '', 'success');
                    this.setState({
                        informacion: this.state.informacion,
                        redirect: true
                    })
                } else {
                    Swal.fire('Error al actualizar la seccion', '', 'info');
                }
            })
            .catch( (err) => {
                Swal.fire('Error al conectar con el servidor', '', 'error');
            })
    }

    submitTest = (e) => {

        const input = document.getElementById("tituloComment").value

        if (input.trim() === '') {
            Swal.fire('Titulo', 'El titulo es obligatorio', 'info')
        }
        else {
            Swal.fire({
                title: 'Creando seccion...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
            });
    
            const descripcion = e;
            const img = document.getElementById("btn_enviar");
            const titulo = document.getElementById("tituloComment").value;
    
            if (img.files[0]) {
    
                const headers = {
                    authorization: `Bearer ${JWT.getJWT()}`
                }
    
                const formData = new FormData();
    
                formData.append(
                    'file0',
                    img.files[0],
                    img.files[0].name
                )
    
                Axios.post(Global.servidor + "saveImageForo", formData, {headers})
                    .then((resp) => {
                        const informationSend = {
                            id: this.state.informacion._id,
                            data: {
                                titulo, 
                                descripcion, 
                                imagen: resp.data.image
                            }
                        }
    
                        this.sendForo(informationSend)
                    })
                    .catch((err) => {
                        Swal.fire('Error al subir imagen', '', 'info');
                    })
            } else{
                const informationSend = {
                    id: this.state.informacion._id,
                    data: {
                        titulo, 
                        descripcion, 
                        imagen: this.state.informacion.imagen
                    }
                }
    
                this.sendForo(informationSend)
            }
        }
    }

    getForo = () => {
        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }
        Axios.get(Global.servidor + "getForo/" + this.props.match.params.id, {headers})
            .then((resp) => {
                this.setState({
                    informacion: resp.data.Foros[0]
                })
                document.getElementById("tituloComment").value = resp.data.Foros[0].titulo;
                document.getElementById("editor").innerHTML = resp.data.Foros[0].descripcion;

                if (resp.data.Foros[0].imagen !== null) {
                    document.getElementById("imagePrevia").src = resp.data.Foros[0].imagen
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }

    UNSAFE_componentWillMount() {
        this.getForo()
    }

    render(){

        if (this.state.redirect) {
            return (<Redirect to="/Foro"></Redirect>)
        }
        return (
            <Fragment>
                <HeaderComponent></HeaderComponent>
                {
                    this.state.informacion !== null ? (
                        <Editor onSubmit={this.submitTest}></Editor>
                    ) : (
                        <label>Cargando...</label>
                    )
                }
            </Fragment>
        )
    }
}