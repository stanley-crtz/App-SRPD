import React, {Component, Fragment} from 'react'
import Foro from './Foro';

export default class Foros extends Component {

    update = () => {
        this.props.update("update")
    }

    render(){

        if (this.props.Data != null) {
            
            var Foros = this.props.Data.map((val) => {
                return (
                    <Foro
                        Data={val}
                        key={val._id}
                        update={this.update}
                    ></Foro>
                )
            });

            return(
                <Fragment>{Foros}</Fragment>
            )

        } else {
            return (
                <label>Cargando....</label>
            )
        }
    }
}