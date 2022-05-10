import React, {useState} from "react";

import "../../assets/style/style.css"

import { NodeSelectPopup } from "../../components/node_select_popup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { EditProfilePopup } from "../edit_profile_popup";

export const Titlebar = ({pageTitle, setExtNodePopup, setExtProfPopup, extNodeCode}) => {
    const [currentNodeCode, setCurrentNodeCode] = useState(null)
    const [nodePopup, setNodePopup] = useState(false);
    const [profPopup, setProfPopup] = useState(false);

    useState(() => {
        var node = eval('('+localStorage.getItem("currentNode")+')')
        if (node) {
            setCurrentNodeCode(node.nodeCode)
        } else {
            setCurrentNodeCode('-')
        }
    }, [])

    function handleNodeConfirm(currentNode) {
        localStorage.setItem("currentNode", JSON.stringify(currentNode))
        setCurrentNodeCode(eval('('+localStorage.getItem("currentNode")+')').nodeCode)
        setNodePopup(false)
    }
    
    function handleNodeCancel() {
        console.log(localStorage)
        setNodePopup(false)
    }

    function handleEditProfConfirm(newProfile) {
        localStorage.setItem("userData", JSON.stringify(newProfile))
        // setUserData(eval('('+localStorage.getItem("userData")+')'))
        setProfPopup(false)

    }
    
    function handleEditProfCancel() {
        console.log(localStorage)
        setProfPopup(false)
    }



    return (
        <div className="content-title-container">
            <h1>{pageTitle}</h1>

            <div>
                { setExtNodePopup && extNodeCode ? (
                    <button onClick={() => setExtNodePopup(true)} className="node-select-button">
                        <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {extNodeCode}
                    </button>
                ) : 
                <button onClick={() => setNodePopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
                </button>}
                
                { setExtProfPopup ? (
                    <button onClick={() => setExtProfPopup(true)} className="node-select-button">
                        <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Edit Profile
                    </button>
                ) : 
                <button onClick={() => setProfPopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Edit Profile
                </button>}
            </div>
            
            
            { nodePopup && setExtNodePopup == undefined && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handleNodeConfirm} handleCancel={handleNodeCancel}/>}
            { profPopup && setExtProfPopup == undefined && <EditProfilePopup setOpenPopup={setProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel}/>}

        </div>
    )
}