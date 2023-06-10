import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import PostDetail from "../../components/PostDetail";


const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {documents: posts, loading} = useFetchDocuments("posts");

  const buscar = (e) => {
    e.preventDefault();

    if(search) {
      return navigate(`/busca?q=${search}`);
    }
  }

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes</h1>
      <form onSubmit={buscar} className={styles.search_form}>
        <input type="text" placeholder="Ou busque por tags..." onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-dark">Pesquisar</button>
      </form>
      <div>
        {loading && <p>Carregando...</p>}
        {posts && posts.map((post) => 
          <PostDetail key={post.id} post={post} />
        )}
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/posts/criar-post" className="btn">Criar primeiro post</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;