import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";


const Dashboard = () => {
    const {user} = useAuthValue();
    const uid = user.uid;
    const { deleteDocument } = useDeleteDocument("posts");
    const { documents: posts, loading } = useFetchDocuments("posts", null, uid);

    if(loading) {
        return <p>Carregando...</p>
    }

    return (
        <div className={styles.dashboard}>
            <h2>Dashboard</h2>
            <p>Gerencie os seus posts</p>
            {(posts && posts.length === 0) ? (
                <div className={styles.noposts}>
                    <p>Não foram encontrados posts</p>
                    <Link to="/posts/criar-post" className="btn"> Criar primeiro post</Link>
                </div>
            ) : (
                <>
                    <div className={styles.post_header}>
                        <span>Titúlo</span>
                        <span>Açôes</span>
                    </div>
                    {posts && posts.map((post) => (
                        <div key={post.id} className={styles.post_row}>
                            <p>{post.title}</p>
                            <div>
                                <Link to={`/posts/${post.id}`} className="btn btn-outline">
                                    Ver
                                </Link>
                                <Link to={`/posts/edit/${post.id}`} className="btn btn-outline">
                                    Editar
                                </Link>
                                <button onClick={() => deleteDocument(post.id)} className="btn btn-danger btn-outline">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default Dashboard;