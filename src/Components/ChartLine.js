import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import Global from '../Global';

export default class CharLine extends Component {

  constructor(props){
    super(props)
    this.connectSocket = Global.ConnectChat;
  }

  state = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    dataset: [65, 59, 80, 81, 56, 55, 40]
  }

  searchVisits = () => {
    this.connectSocket.emit("requestVisitas", {})
  }

  manipularData = (labels, dataset) => {
    this.setState({
      labels,
      dataset
    })
  }

  UNSAFE_componentWillMount(){

      this.searchVisits()
      this.connectSocket.on("receivedVisit", (data) => {
          
        var labels = [], dataset = []

        data.forEach(visitas => {
          labels.push(visitas.fecha);
          dataset.push(visitas.visitas);
        });

        this.manipularData(labels, dataset)
      })

      this.connectSocket.on("searchVisit", (data) => {
          this.searchVisits()
      })
  }

  render(){

    const {labels, dataset} = this.state

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Actividad de la aplicaión',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataset
        }
      ]
    };

    return(

      <div className="chart">

        <h2>Actividad de la aplicación</h2>
        <Line data={data} />

      </div>

    )
  }
}

// export default React.createClass({
//   displayName: 'LineExample',

//   render() {
//     return (
      
//     );
//   }
// });