import React, {Component} from 'react'
import Moment from 'moment'
import Global from '../Global'
import {Link} from 'react-router-dom'
import Identificador from '../Class/Identificador'
import Axios from 'axios'
import JWT from '../Class/JWT'
import Swal from 'sweetalert2'

export default class Docente extends Component {

    deleteDocente = (data) => {

        Swal.fire({
            title: '¿Estas seguro de Eliminar este docente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Eliminando Docente...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },
                });
        
                const headers = {
                    authorization: `Bearer ${JWT.getJWT()}`
                }
                Axios.delete(Global.servidor + "DeleteDocente/" + data, {headers})
                    .then((resp) => {
                        this.props.delete(true)
                        Swal.close()
                    })
                    .catch((err) => {
                        Swal.close()
                        Swal.fire('Error', 'Error en el servidor intentelo mas tarde', 'error')
                    })
            }
          });

    }

    render() {
        Moment.locale('es');
        const data = this.props.Data;
        return (
            <div className="Docente">
                <div className="Docente-Image">
                    <img src={Global.servidor + "getImagePerfil/" + data.PerfilImage} alt={data.Nombre}></img>
                </div>
                <div className="Docente-Info">
                    <div className="Docente-Name">
                    <h2>{data.Nombre}</h2>
                        <hr></hr>
                    </div>
                    <div className="Docente-Carrera">
                        <label>Carrera: </label> <em><span>{data.Academica.Carrera}</span></em>
                    </div>
                    <div className="Docente-Group">
                        <div className="Docente-Edad left">
                            Edad: <em><strong>{Moment().diff(data.FechaNac, 'years')}</strong></em>
                        </div>
                        <div className="Docente-Egreso rigth">
                            Fecha de Egreso: <em><span>{Moment(data.Academica.Egreso).add(1, 'days').format('L')}</span></em>
                        </div>
                    </div>
                    <div className="Docente-Group">
                        <div className="Docente-Nivel left">
                            Nivel: <em><span>{data.Academica.NivelDocente}</span></em>
                        </div>
                        <div className="Docente-Categoria rigth">
                            Categoría: <em><span>{data.Academica.CategoriaDocente}</span></em>
                        </div>
                    </div>
                    {
                        !Identificador.validatorIdentificador() &&
                            <div className="Docente-Group">
                                <div className="Docente-Nivel left">
                                    <Link to={"/Registro/Editar/" + data._id} className="btn Editar">Editar</Link>
                                </div>
                                <div className="Docente-Categoria rigth">
                                    <button onClick={(e) => this.deleteDocente(data._id)} className="btn Eliminar">Eliminar</button>
                                </div>
                            </div>

                    }
                </div>
            </div>
        )
    }
}