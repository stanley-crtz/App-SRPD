import React, { Fragment } from 'react'
// import Tarjeta from '../Components/Tarjeta'
import HeaderComponent from '../Components/Header'

export const Home = (props) => {
    
    return (
        <Fragment>
            <HeaderComponent></HeaderComponent>
            
            <section className="text-center team">
                <div className="container p-5">
                    {/* <h1 className="text-center text-dark"></h1> */}
                    
                    <div className="row">
                        {/* <Tarjeta
                            title='Ayuda'
                            description='pagina para registrarte como profesional'
                            image="https://img.freepik.com/foto-gratis/asistencia-trabajo-equipo-concepto-logro-silueta-hombre-que-ayuda-al-amigo-al-exito_28629-413.jpg?size=626&ext=jpg"
                        />
                        <Tarjeta
                            title='Ayuda'
                            description='pagina para registrarte como profesional'
                            image="https://img.freepik.com/foto-gratis/asistencia-trabajo-equipo-concepto-logro-silueta-hombre-que-ayuda-al-amigo-al-exito_28629-413.jpg?size=626&ext=jpg"
                        />
                        <Tarjeta
                            title='Ayuda'
                            description='pagina para registrarte como profesional'
                            image="https://img.freepik.com/foto-gratis/asistencia-trabajo-equipo-concepto-logro-silueta-hombre-que-ayuda-al-amigo-al-exito_28629-413.jpg?size=626&ext=jpg"
                        />
                        <Tarjeta
                            title='Ayuda'
                            description='pagina para registrarte como profesional'
                            image="https://img.freepik.com/foto-gratis/asistencia-trabajo-equipo-concepto-logro-silueta-hombre-que-ayuda-al-amigo-al-exito_28629-413.jpg?size=626&ext=jpg"
                        />
                        <Tarjeta
                            title='Ayuda'
                            description='pagina para registrarte como profesional'
                            image="https://img.freepik.com/foto-gratis/asistencia-trabajo-equipo-concepto-logro-silueta-hombre-que-ayuda-al-amigo-al-exito_28629-413.jpg?size=626&ext=jpg"
                        /> */}
                        
                    </div>
                </div>
            </section>
        </Fragment>
    );
}