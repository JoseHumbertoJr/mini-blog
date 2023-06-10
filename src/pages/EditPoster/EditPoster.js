import { useEffect, useState } from "react";
import styles from "./EditPoster.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/updateDocument";

const EditPoster = () => {
    const { id } = useParams();
    const { document: post } = useFetchDocument("posts", id);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState(undefined);
    const {updateDocument, response} = useUpdateDocument("posts");
    const {user} = useAuthValue();
    const navigate = useNavigate();

    useEffect(() => {        
        if(post){        
            setTitle(post.title);
            setImage(post.image);
            setBody(post.body);
            setTags(post.tags);
            const textTags = post.tagsArray.join(", ");
            setTags(textTags);
        }
    }, [post]);

    const editarPost = (e) => {
        e.preventDefault();      
        setFormError("");                        
        //criar array de tags
        const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
        //checar todos os valores 
        if(!title || !image || !tags || !body) {
            setFormError("Por favor, preencha todos os campos!");
        }
        if(formError) return;
        //validacao da url
        try {
            var url = new URL(image);            
            if(url) {
                const data = {
                    title, image, body, tagsArray, uid: user.uid, createdBy: user.displayName
                }
                updateDocument (id, data);
            }
        } catch (error) {
            setFormError("A imagem precisa ser uma URL.");            
        } 
        //redirect para home page
        navigate("/dashboard");
    }

    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h1>Editando post: {post.title}</h1>
                    <p>Altere os dados do post como desejar!</p>
                    <form onSubmit={editarPost}>
                        <label>
                            <span>Título</span>
                            <input type="text" name="title" required onChange={(e) => setTitle(e.target.value)}
                                value={title} placeholder="Pense num bom título..." />
                        </label>
                        <label>
                            <span>Url da Imagem</span>
                            <input type="text" name="url" required onChange={(e) => setImage(e.target.value)}
                                value={image} placeholder="Insira uma image que representa o seu post" />
                        </label>
                        <p className={styles.preview}>Preview da imagem atual:</p>
                        <img src={post.image} className={styles.image_preview} alt={post.title} />
                        <label>
                            <span>Conteúdo</span>
                            <textarea name="conteudo" required placeholder="Insira o conteudo do post"
                                onChange={(e) => setBody(e.target.value)} value={body} />
                        </label>
                        <label>
                            <span>Tags</span>
                            <input type="text" name="tags" required onChange={(e) => setTags(e.target.value)}
                                value={tags} placeholder="Insira as tags separadas por vírgula" />
                        </label>
                        {!response.loading && <button className="btn">Editar</button>}
                        {response.loading && <button className="btn" disabled>Aguarde...</button>}
                        {response.error && <p className="error">{response.error}</p>}
                        {formError && <p className="error">{formError}</p>}
                    </form>
                </>
            )}
        </div>        
    )
}

export default EditPoster;