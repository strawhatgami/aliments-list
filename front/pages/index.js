import {useState} from "react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { customFetch } from '../modules/utils.js';
const API_ROOT_INTERNAL = "http://courses-back:3000";
const API_ROOT_EXTERNAL = "http://localhost:3003";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(API_ROOT_INTERNAL + '/users/me')
    const json = await res.json()

    return {
      props: json,
    }
  }
  catch (e) {
    return {
      props: {
        error: e.toString(),
      },
    }
  }
}

const getAuth = async () => {
  const auth = await customFetch({
    uri: API_ROOT_EXTERNAL + '/users/me',
  });

  return auth;
}

async function doLogin(username, password) {
  await customFetch({
    method: "POST",
    uri: API_ROOT_EXTERNAL + '/auth/login',
    content: { username, password },
  });
}

const AuthForm = ({refreshUserInfo}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
// TODO check que les champs ne sont pas vides avant de les envoyer au serveur
    await doLogin(username, password);
// TODO traiter les 401 (bad login and/or password)
    await refreshUserInfo();
  }
  return (
    <div>
      <input name="username" type="text" placeholder='email' value={username} onChange={(e) => setUsername(e.target.value)}></input>
      <input name="password" type="password" placeholder='mot de passe' value={password} onChange={(e) => setPassword(e.target.value)}></input>
      <button onClick={() => login()}>Se connecter / S'enregistrer</button>
    </div>
  );
}

const View = ({ data }) => {
  if (!data?.name) {
    return (
      <div>
        <h2>Non connecté</h2>
      </div>
    );
  }

  return <div></div>;
}

const AuthInfo = ({ data, error, refreshUserInfo }) => {
  if (error) return <div>Failed to load ({error})</div>
  if (!data?.name) {
    return <AuthForm refreshUserInfo={refreshUserInfo} />;
  }

  const logout = async () => {
    await customFetch({ uri: API_ROOT_EXTERNAL + '/auth/logout' });
    await refreshUserInfo();
  }

  return (
    <div>
      <h1>Bienvenue, {data.name}.</h1>
      <button onClick={() => logout()}>déconnexion</button>
    </div>
  );
}

export default function Home({ data, error }) {
  const [state, setState] = useState({ data, error });
  const refreshUserInfo = async () => {
    try {
      const { data, error } = await getAuth();
      setState({data, error});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Mon Projet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Mon projet</h1>
        <AuthInfo
          data={state.data}
          error={state.error}
          refreshUserInfo={refreshUserInfo}
        />
        <View data={state.data} />
      </main>
    </div>
  )
}
