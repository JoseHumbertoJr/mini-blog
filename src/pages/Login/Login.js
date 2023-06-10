import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import styles from "./Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const { login, error: AuthErrorCodes, loading } = useAuthentication();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        const user = {
            email,
            senha
        }
        const res = await login(user);              
    }
    useEffect(() => {
        if(AuthErrorCodes) {
            setError(AuthErrorCodes);
        }
    }, [AuthErrorCodes])

    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça o login para ultilizar o sistema</p>
            <form onSubmit={submit}>
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
                {!loading && <button className="btn">Entrar</button>}
                {loading && <button className="btn" disabled>Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
};

export default Login;