import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";
import { Timestamp, addDoc, collection } from "firebase/firestore";

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {       
    switch(action.type){        
        case "LOADING":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            console.log("afsaffas",action.type);
            return state;
    } 
}

export const useInsertDocument = (docCollection) => {
    const [response, dispatch] = useReducer(insertReducer, initialState);
    //memory leak
    const [canceled, setCanceled] = useState(false);
    const checkCanceledDispatch = (action) => {
        if(canceled) {            
            dispatch(action);
        }
    }
    
    const insertDocument = async(document) => {
        checkCanceledDispatch({
            type: "LOADING",
        })        
        try {            
            const newDocument = {...document, createAt: Timestamp.now()};                        
            const insertDocument = await addDoc(
                collection(db, docCollection), newDocument
            )            
            checkCanceledDispatch({
                type: "INSERTED_DOC",
                payload: insertDocument
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
    return {insertDocument, response}
}
