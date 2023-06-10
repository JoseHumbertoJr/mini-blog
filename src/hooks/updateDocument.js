import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

const initialState = {
    loading: null,
    error: null
}

const updateReducer = (state, action) => {       
    switch(action.type){        
        case "LOADING":
            return {loading: true, error: null}
        case "UPDATED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            console.log("afsaffas",action.type);
            return state;
    } 
}

export const useUpdateDocument = (docCollection) => {
    const [response, dispatch] = useReducer(updateReducer, initialState);
    //memory leak
    const [canceled, setCanceled] = useState(false);
    const checkCanceledDispatch = (action) => {
        if(canceled) {            
            dispatch(action);
        }
    }
    
    const updateDocument = async(uid, data) => {
        checkCanceledDispatch({
            type: "LOADING",
        })        
        try {      
            const docRef = await doc(db, docCollection, uid);
            const updatedDocument = await updateDoc(docRef, data);
                  
            checkCanceledDispatch({
                type: "UPDATED_DOC",
                payload: updatedDocument
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
    return {updateDocument, response}
}
