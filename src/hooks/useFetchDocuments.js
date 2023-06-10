import { useEffect, useState } from "react";
import { Await, useFetcher } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export const useFetchDocuments = (docColletion, search = null, uid = null) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    //memory leak
    const [canceled, setCanceled] = useState(false);
    
    useEffect(() => {
        async function loadData() {
            if(canceled) return;
            setLoading(true);

            const collectionRef = await collection(db, docColletion);

            try {
                let consulta;
                if (search) {                    
                    consulta = await query(collectionRef, where("tagsArray", "array-contains", search), 
                        orderBy("createAt", "desc"));                    
                } else if (uid) {
                    consulta = await query(collectionRef, where("uid", "==" , uid), 
                    orderBy("createAt", "desc")); 
                } else {
                    consulta = await query(collectionRef, orderBy("createAt", "desc"));   
                }                               
                await onSnapshot(consulta, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    )
                })
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message);
                setLoading(false);
            }
        }
        loadData();
    },[docColletion, search, uid, canceled]);

    useEffect(() => {
        return () => setCanceled(true);
    }, []);
    
    return { documents, loading, error };
}