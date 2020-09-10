import React, {Component} from 'react'
import ListMassage from './ListMassage'
import Global from '../../Global';
import Axios from 'axios'
import Moment from 'moment'
import JWT from '../../Class/JWT';

export default class Mensajes extends Component {

    constructor(props){
        super(props);
        this.connectSocket = Global.ConnectChat

    }

    state = {
        mensajes: []
    }

    sendMessage = (message) => {

        const params = {
            latestChatTime: Moment().format(),
            latestChatMessage: message.info.foto !== null ? 'imagen' : message.info.message,
            id: message.id
        }

        const headers = {
            authorization: `Bearer ${JWT.getJWT()}`
        }

        Axios.put(Global.servidor + "updateChatDocente", params, {headers})
            .then((response) => {
                this.connectSocket.emit("sendMensajes", message);
        
            })
            .catch((err) => {
                console.log(err);
            })
        this.props.clear('')
    }

    seacrhMessage = () => {
        this.connectSocket.emit("requestMessage", this.props.id)
    }

    UNSAFE_componentWillMount(){
        this.seacrhMessage()
        this.connectSocket.on("recivedMensajes", (data) => {
            
            this.setState({
                mensajes: data
            })

            var objDiv = document.querySelector(".messages-list");
            objDiv.scrollTop = objDiv.scrollHeight;
        })

        this.connectSocket.on("searchMSG", (data) => {
            this.seacrhMessage()
        })
    }

    render(){
        const ListData = this.state.mensajes.map( (data, i) => {
            return <ListMassage mensaje={data} image={this.props.image} key={i}></ListMassage>
        })

        if (this.props.data.id) {
            this.sendMessage(this.props.data)
        }
        
        return(
            ListData
        )
    }

}