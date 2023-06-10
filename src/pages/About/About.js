
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
    return (
        <div className={styles.about}>
            <h1>Sobre o Mini <span>Blog</span></h1>
            <p>Este projeto consiste em um blog feito em React no front-end e Firebase 
                no back-end.
            </p>
            <Link to="/posts/criar-post" className="btn">Criar post</Link>
        </div>
    )
}

export default About;