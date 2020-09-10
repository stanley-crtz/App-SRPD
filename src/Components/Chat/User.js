import React, {Component} from 'react'
import Global from '../../Global';
import Moment from 'moment'

export default class User extends Component {

    docenteSelection = () => {
        this.props.docenteSelection(this.props.docente)
    }

    render() {
        const docente = this.props.docente;
        return (
            <div className="user" onClick={this.docenteSelection}>
                <img className="circle-img" src={Global.servidor + "getImagePerfil/" + docente.PerfilImage} alt=""/>
                <div className="user-info">
                    <div className="user-title">
                        <label className="contact">{docente.Nombre}</label>
                        <label className="fecha">{Moment(docente.latestChatTime).fromNow(Date.now)}</label>
                    </div>
                    <label className="msg">{docente.latestChatMessage}</label>
                </div>
            </div>
        )
    }
}