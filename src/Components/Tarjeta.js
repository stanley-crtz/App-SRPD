import React, {Component} from 'react'

export default class Tarjeta extends Component {

    state = {
        img: '',
        title: '',
        description: ''
    }

    UNSAFE_componentWillMount(){
        this.setState({
            img: this.props.image,
            title: this.props.title,
            description: this.props.description
        });
    }

    render(){
        return (
            <div className="col-lg-3">
                <div className="card">
                    <div className="card-body bg-primary" >
                        <img src={this.state.img} className="img-fluid rounded-circle w-50" alt={this.state.title}/>
                        <h3>{this.state.title}</h3>
                        <p>
                            {this.state.description} 
                        </p>
                        <div className="d-flex flex-row justify-content-center">
                            <div className="p-4">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <input type="button" value="Ingresar" className="btn" onClick={() => console.log("Si di click")}/>
            </div>
        )
    }
}