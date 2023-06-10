import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const initialState = {
    loading: null,
    error: null
}

const deleteReducer = (state, action) => {       
    switch(action.type){        
        case "LOADING":
            return {loading: true, error: null}
        case "DELETED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            console.log("afsaffas",action.type);
            return state;
    } 
}

export const useDeleteDocument = (docCollection) => {
    const [response, dispatch] = useReducer(deleteReducer, initialState);
    //memory leak
    const [canceled, setCanceled] = useState(false);
    const checkCanceledDispatch = (action) => {
        if(canceled) {            
            dispatch(action);
        }
    }
    
    const deleteDocument = async(id) => {
        checkCanceledDispatch({
            type: "LOADING",
        })        
        try {            
            const deleteDocument = await deleteDoc(doc(db, docCollection, id));

            checkCanceledDispatch({
                type: "DELETED_DOC",
                payload: deleteDocument
            })            
        } catch (error) {         
            checkCanceledDispatch({
                type: "ERROR",
                payload: error.message
            })          
        }        
    }

    useEffect(() => {    
        return () => setCanceled(true);
    },[])    
    return {deleteDocument, response}
}
