import { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { useAuthentication } from "../../hooks/useAuthentication";


const Register = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [error, setError] = useState("");
    const { createUser, error: AuthErrorCodes, loading } = useAuthentication();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if(senha !== confirmSenha) {
            setError("As senhas precisam ser iguais");            
            return ;
        }
        const user = {
            displayName,
            email,
            senha
        }
        const res = await createUser(user);
        console.log("USER", user);        
    }
    useEffect(() => {
        if(AuthErrorCodes) {
            setError(AuthErrorCodes);
        }
    }, [AuthErrorCodes])

    return (
        <div className={styles.register}>
            <h1>Cadastre-se</h1>
            <p>Crie seu usuário e compartilhe suas histórias</p>
            <form onSubmit={submit}>
                <label>
                    <span>Nome: </span>
                    <input type="text" name="displayName" 
                        required placeholder="Nome do usuário" 
                        value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    />
                </label>
                <label>
                    <span>Email: </span>
                    <input type="email" name="email" 
                        required placeholder="Email do usuário" value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <span>Senha: </span>
                    <input type="password" name="password" 
                        required placeholder="Senha do usuário" 
                        value={senha} onChange={(e) => setSenha(e.target.value)}
                    />
                </label>
                <label>
                    <span>Confirme sua senha: </span>
                    <input type="password" name="ConfirmPassword" required placeholder="Confirme sua senha"
                        value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)}
                    />
                </label>
                {!loading && <button className="btn">Cadastrar</button>}
                {loading && <button className="btn" disabled>Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
};

export default Register;