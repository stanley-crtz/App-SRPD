import React, { useState, useEffect } from 'react';
import { BoldIcon, CenterAlignIcon, ItalicIcon, JustifyAlignIcon, LeftAlignIcon, ListIcon, ListOrdenedIcon, RedoIcon, RightAlignIcon, UnderlineIcon, UndoIcon } from '../Icons';
import './styles.css';
import Image from '../../../../Assets/Images/svg/iconImage.svg'

export default function Toolbar() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [ol, setOl] = useState(false);
  const [ul, setUl] = useState(false);

  //Função para manipular a fomatação html do campo de edição
  const format = (command) => {
    document.execCommand(command);

    // setando estados dos botões
    switch (command) {
      case 'bold':
        setBold(true);
        break;
      case 'italic':
        setItalic(true);
        break;
      case 'underline':
        setUnderline(true);
        break
      case 'insertOrderedList':
        setOl(true);
        break;
      default:
        setUl(true);
    }
  }

  // Analisa a posição ou texto selcionado pelo cursor e seta os estados dos estilos aplicados
  const navUpdate = () => {
    const range = window.getSelection().getRangeAt(0); // guardando a área selecionada
    const parentList = []; // guardará uma lista com todos os nós pais da área selecionada

    
    let tempBold = false;
    let tempItalic = false;
    let tempUnderline = false;
    let tempOl = false;
    let tempUl = false;

    // buscará os pais do nó selecionado recursivamente e adicionará na lista
    function gettingNodeParents(node) {
      parentList.push(node);
      if (node.parentElement) {
        gettingNodeParents(node.parentElement);

      }

    }

    // preenchendo lista de nós
    gettingNodeParents(range.startContainer.parentElement);

    // percorrendo lista de nós, é preciso ter pelo menos 1 nó para estilo aplicado
    parentList.forEach((element) => {
      if (element.tagName === 'B' || element.tagName === 'STRONG') tempBold = true;
      if (element.tagName === 'I') tempItalic = true;
      if (element.tagName === 'U') tempUnderline = true;
      if (element.tagName === 'OL') tempOl = true;
      if (element.tagName === 'UL') tempUl = true;
    });

    // setando estados
    
    setBold(tempBold);
    setItalic(tempItalic);
    setUnderline(tempUnderline);
    setOl(tempOl);
    setUl(tempUl);

  }

  const changeImage = (event) => {
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("imagePrevia").src = e.target.result // Renderizamos la imagen
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  useEffect(() => {

    // buscando div editávl do editor pelo DOM
    let editor = document.getElementById('editor');

    // configurando gatilho de update de estilos aplicados
    editor.onclick = navUpdate;
    editor.onkeydown = navUpdate;
    editor.onkeyup = navUpdate;
    editor.onkeypress = navUpdate;
    editor.onchange = navUpdate;
  });

  return (
    <>
      <div className="toolbar-content">
        <button onClick={() => format('undo')} > <UndoIcon /> </button>
        <button onClick={() => format('redo')}> <RedoIcon /> </button>

        <div className="toolbar-divisor" />

        <button onClick={() => format('bold')}> <BoldIcon fill={bold ? '#4682B4' : null} /> </button>
        <button onClick={() => format('italic')}> <ItalicIcon fill={italic ? '#4682B4' : null} /> </button>
        <button onClick={() => format('underline')}> <UnderlineIcon fill={underline ? '#4682B4' : null} /> </button>

        <div className="toolbar-divisor" />

        <button onClick={() => format('justifyFull')} > <JustifyAlignIcon /> </button>
        <button onClick={() => format('justifyLeft')}> <LeftAlignIcon /> </button>
        <button onClick={() => format('justifyCenter')}> <CenterAlignIcon /> </button>
        <button onClick={() => format('justifyRight')} > <RightAlignIcon /> </button>
        <button onClick={() => format('insertOrderedList')} > <ListOrdenedIcon fill={ol ? '#4682B4' : null} /> </button>
        <button onClick={() => format('insertUnorderedList')}> <ListIcon fill={ul ? '#4682B4' : null} /> </button>

        <div className="toolbar-divisor" />
        <div id="div_file" className="toolbar-img-button">
            <img src={Image} alt="icono"/>
            <input type="file" id="btn_enviar" accept="image/*" onChange={changeImage}/>
        </div>
        

      </div>

    </>
  )
} 