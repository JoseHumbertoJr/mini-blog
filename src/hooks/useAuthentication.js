import { db } from "../firebase/config";
import { createUserWithEmailAndPassword, 
    getAuth, signInWithEmailAndPassword, 
    signOut, updateProfile } from "firebase/auth";

import { useEffect, useState } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //cleanUp para excluir requicios de açoes ainda em andamento
    const [canceled, setCanceled] = useState(false);
    const auth = getAuth();

    function checkIsCanceled() {
        if(canceled) {
            return;
        }
    }

    const createUser = async (data) => {
        checkIsCanceled();

        setLoading(true);
        setError("");

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.senha
            )
            await updateProfile(user, {
                displayName: data.displayName
            })
            setLoading(false);
            return user;

        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);
            let erroMessage;
            if(error.message.includes("Password")) {
                erroMessage = "A senha precisa conter pelo mesnos 6 caracteres";
            } else if (error.message.includes("email-already"))         {
                erroMessage = "E-mail já cadastrado.";
            } else {
                erroMessage = "Ocorreu um erro, por favor tente mais tarde!";
            }
            setLoading(false);
            setError(erroMessage);
        }
    }

    // logout
    const logout = () => {
        signOut(auth);
    }

    // login
    const login = async(data) => {
        checkIsCanceled();
        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.senha);
            setLoading(false);
        } catch (error) {
            let erroMessage;
            if(error.message.includes("user-not-found")) {
                erroMessage = "Usuário não encontrado.";
            } else if (error.message.includes("wrong-password")) {
                erroMessage = "Senha incorreta.";
            } else {
                erroMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }
            setError(erroMessage);
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => setCanceled(true);
    }, []);

    return {auth, createUser, error, loading, logout, login }

}
