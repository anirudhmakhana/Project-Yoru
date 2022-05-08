import React, {useState} from "react";

import "../../assets/style/style.css"

import { NodeSelectPopup } from "../../components/node_select_popup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export const Titlebar = (props) => {
    const [currentNodeCode, setCurrentNodeCode] = useState(null)
    const [buttonPopup, setButtonPopup] = useState(false);

    useState(() => {
        var node = eval('('+localStorage.getItem("currentNode")+')')
        if (node) {
            setCurrentNodeCode(node.nodeCode)
        } else {
            setCurrentNodeCode('-')
        }
    }, [])

    function handlePopupConfirm(currentNode) {
        localStorage.setItem("currentNode", JSON.stringify(currentNode))
        setCurrentNodeCode(eval('('+localStorage.getItem("currentNode")+')').nodeCode)
        setButtonPopup(false)
    }
    
    function handlePopupCancel() {
        console.log(localStorage)
        setButtonPopup(false)
    }


    return (
        <div className="content-title-container">
            <h1>{props.pageTitle}</h1>
            <button onClick={() => setButtonPopup(true)} className="node-select-button">
                <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
            </button>
            {/* { buttonPopup && <NodeSelectPopup setOpenPopup={setButtonPopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel}/>} */}
        </div>
    )
}