import React from 'react';
import Toolbar from './components/Toolbar';
import './styles.css';
import { Link } from 'react-router-dom';

export default function Editor({ style, onSubmit }) {

  // tratando submit do editor
  function handleSubmit(){
    const editor = document.getElementById('editor');

    if(onSubmit){
      
      return onSubmit(editor.innerHTML);
    }

    return console.log(undefined);
  }

  return (
    <div>

      <div className="container_comment">
        <div className="container-comment-data">
          
          <div className="container-comment-data-title">
            <p>
              Título:
            </p>
            <input id="tituloComment" className="comment-title" type="text" placeholder="Título......"></input>
          </div>

          <div
            id="editor"
            className="editor-paper"
            style={style}
            contentEditable="true"
            designmode="on"
            spellCheck="true" />

          <Toolbar />
        </div>
        <img id="imagePrevia" src="https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg" alt="No imagen"></img>
      </div>

      <div className="controls-content">
        <button id="salve" className="editor-button publish" onClick={handleSubmit} >PUBLICAR</button>
        <Link to="/Foro" className="editor-button cancel">CANCELAR</Link>
      </div>

    </div>
  )
} 