import { useState } from "react";
import styles from "./CreatePoster.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePoster = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState(undefined);
    const {insertDocument, response} = useInsertDocument("posts");
    const {user} = useAuthValue();
    const navigate = useNavigate();

    const criarPost = (e) => {
        e.preventDefault();      
        setFormError("");                        
        //criar array de tags
        const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
        //checar todos os valores 
        if(!title || !image || !tags || !body) {
            setFormError("Por favor, preencha todos os campos!");
        }
        //validacao da url
        try {
            var url = new URL(image);            
            if(url) {
                insertDocument ({title, image, body, tagsArray, uid: user.uid, createdBy: user.displayName});
            }
        } catch (error) {
            setFormError("A imagem precisa ser uma URL.");            
        } 
        //redirect para home page
        navigate("/");
    }

    return (
        <div className={styles.create_post}>
            <h1>Crie seu poster</h1>
            <p>Escreva sobre o que você quiser e compartilhe seu conhecimento!</p>
            <form onSubmit={criarPost}>
                <label>
                    <span>Título</span>
                    <input type="text" name="title" required onChange={(e) => setTitle(e.target.value)}
                        value={title} placeholder="Pense num bom título..."/>
                </label>
                <label>
                    <span>Url da Imagem</span>
                    <input type="text" name="url" required onChange={(e) => setImage(e.target.value)}
                        value={image} placeholder="Insira uma image que representa o seu post"/>
                </label>
                <label>
                    <span>Conteúdo</span>
                    <textarea name="conteudo" required placeholder="Insira o conteudo do post"
                        onChange={(e) => setBody(e.target.value)} value={body}/>
                </label>
                <label>
                    <span>Tags</span>
                    <input type="text" name="tags" required onChange={(e) => setTags(e.target.value)}
                        value={tags} placeholder="Insira as tags separadas por vírgula"/>
                </label>    
                {!response.loading && <button className="btn">Cadastrar</button>}
                {response.loading && <button className="btn" disabled>Aguarde...</button>}
                {response.error && <p className="error">{response.error}</p>}
                {formError && <p className="error">{formError}</p>}                             
            </form>
        </div>        
    )
}

export default CreatePoster;