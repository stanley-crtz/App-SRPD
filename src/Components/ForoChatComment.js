import React, {Component} from 'react'
import Moment from 'moment'

export default class ForoChat extends Component {

    render(){
        const data = this.props.data;
        return(
            <div className="container-chat-others">
                
                <div className="others">
                    <img className="circle-img" src={data.PerfilImage[0]} alt=""/>
                    
                    <div className="Nombre-Incorporado">
                        <div className="full">
                            <label>{data.Nombre[0]}</label>
                        </div>

                        <div className="chat-others full up">
                            {
                                data.imagen !== null ? (
                                    <img className="image-chat" src={data.imagen} alt="foto Comentario" />
                                ) : (
                                    data.comment
                                )
                            }
                        </div>
                    </div>
                    
                </div>
                <div className="fecha">
                    <label >{Moment(data.date).fromNow(Date.now)}</label>
                </div>
            </div>
        )
    }
}