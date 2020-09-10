import React, {Component, Fragment} from 'react'
import Docente from './Docente';

export default class Docentes extends Component {

    delete = (e) => {
        this.props.delete(true)
    }

    render(){

        if (this.props.Data != null) {
            
            var Docentes = this.props.Data.map((val) => {
                return (
                    <Docente
                        Data={val}
                        key={val._id}
                        delete={this.delete}
                    ></Docente>
                )
            });

            return(
                <Fragment>{Docentes}</Fragment>
            )

        } else {
            return (
                <label>Cargando....</label>
            )
        }
    }
}