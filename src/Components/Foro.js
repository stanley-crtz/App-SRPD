import React, {Component} from 'react'
import Moment from 'moment'
import {Link, Redirect} from 'react-router-dom'
import Global from '../Global';
import Axios from 'axios';
import Swal from 'sweetalert2';
import JWT from '../Class/JWT'
import Identificador from '../Class/Identificador';

export default class Foro extends Component {

    state = {
        mostar: false,
        redirect: false
    }

    mostrarMenu = () => {
        this.setState({
            mostar: !this.state.mostar,
            redirect: false
        })
    }

    eliminandoRegistro = () => {
        Swal.fire({
            title: 'Eliminando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.delete(Global.servidor + "deleteForo/" + this.props.Data._id, {headers})
            .then((resp) => {
                if (resp.data.status === "success") {
                    this.props.update("data")
                    Swal.close();
                }
                else{
                    Swal.fire('Error','Surgio un error en el servidor', 'error');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    eliminar = () => {

        Swal.fire({
            title: '¿Esta seguro de eliminarlo?',
            text: "Si elimina este foro no podra ser recuperado",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              this.eliminandoRegistro()
            }
          })
        
    }

    editar = () => {
        this.setState({ 
            mostar: this.state.mostar,
            redirect: true 
        })
    }

    
    render() {

        Moment.locale('es');
        const data = this.props.Data;
        const ruta = "/Foro/" + data._id

        if (this.state.redirect) {
            return <Redirect to={'/Foro/Editar/' + data._id}/>;
        }

        var menu = ''

        if (Identificador.getIdentificador() === data.idDocente[0] || !Identificador.validatorIdentificador()) {
            menu = (
                <div className="menu-Tarjeta">

                    <i className={ this.state.mostar ? "fas fa-align-right selected" : "fas fa-align-right"} onClick={this.mostrarMenu}></i>

                    <div className={ this.state.mostar ? "opciones" : "opciones hide"}>
                        <div className="menu-Tarjeta-Opcion" onClick={this.editar}>
                            Editar
                        </div>
                        <div className="menu-Tarjeta-Opcion" onClick={this.eliminar}>
                            Eliminar
                        </div>
                    </div>

                </div>
            )
        }

        return (
            <div className="Tarjeta">
                <div className="Tarjeta-Usuario">
                    
                    <img className="circle-img Tarjeta-circle-image" src={data.PerfilImage[0]} alt=""/>
                    <div className="Tarjeta-Publish">
                        <h2>{data.Nombre[0]}</h2>
                        <label>{Moment(data.datePublish).fromNow(Date.now)}</label>
                    </div>
                    
                    {menu}
                    
                </div>
                
                <div className="Tarjeta-Info">
                    <div className="Tarjeta-Name">
                        <h2><u>{data.titulo}</u></h2>
                    </div>
                    <div className="Tarjeta-Description" dangerouslySetInnerHTML={{__html: data.descripcion}}>
                        
                    </div>
                    {
                        data.imagen !== null &&
                            <div className="Tarjeta-Image">
                                <img src={data.imagen} alt={data.titulo}></img>
                            </div>
                    }
                    
                </div>

                <div className="Tarjeta-Comment-Cant">
                    {data.comentarios} Comentarios
                </div>

                <div className="Tarjeta-Comment">
                    <Link to={ruta} className="Tarjeta-Comment-Ref"><i className="far fa-comment"> Comentarios</i></Link>
                </div>
            </div>
        )   
    }
}