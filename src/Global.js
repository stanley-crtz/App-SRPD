import io from 'socket.io-client'

const Global = {
    // servidor: 'http://localhost:3900/',
    // ConnectChat: io('http://localhost:3380'),
    servidor: 'https://srpd-backend.herokuapp.com/',
    ConnectChat: io('https://chat-srpd.herokuapp.com/'),
    EstadoCivil: [
        {value: "Soltero/a", label: "Soltero/a"},
        {value: "Comprometido/a", label: "Comprometido/a"},
        {value: "Casado/a", label: "Casado/a"},
        {value: "Union de hecho", label: "Union de hecho"},
        {value: "Divorciado/a", label: "Divorciado/a"},
        {value: "Viudo/a", label: "Viudo/a"}
    ],
    Genero: [
        {value: "Masculino", label: "Masculino"},
        {value: "Femenino", label: "Femenino"},
        {value: "Otro/a", label: "Otro/a"}
    ],
    CategoriasDocente: [
        {value: 'Categoria 1', label: 'Categoria 1'},
        {value: 'Categoria 2', label: 'Categoria 2'},
        {value: 'Categoria 3', label: 'Categoria 3'},
        {value: 'Categoria 4', label: 'Categoria 4'},
        {value: 'Categoria 5', label: 'Categoria 5'},
        {value: 'Categoria 6', label: 'Categoria 6'}
    ],
    NivelesDocencia: [
        {value: 'Nivel 1 - Lic. En ciencias de la educación', label: 'Nivel 1 - Lic. En ciencias de la educación'},
        {value: 'Nivel 1 - Master en educación', label: 'Nivel 1 - Master en educación'},
        {value: 'Nivel 1 - Doctor en educación', label: 'Nivel 1 - Doctor en educación'},
        {value: 'Nivel 2 - Profesor', label: 'Nivel 2 - Profesor'}
    ]
}

export default Global;