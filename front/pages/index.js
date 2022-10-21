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

const createAliment = async (label, description) => {
  const response = await customFetch({
    method: "POST",
    content: {label, description},
    uri: API_ROOT_EXTERNAL + '/aliments',
  });

  return response;
}

const searchAlimentsByLabel = async (search) => {
  const response = await customFetch({
    method: "GET",
    content: {search},
    uri: API_ROOT_EXTERNAL + '/aliments',
  });

  return response;
}

const findListsByLabel = async (search) => {
  const response = await customFetch({
    method: "GET",
    content: {search},
    uri: API_ROOT_EXTERNAL + '/lists',
  });

  return response;
}

const addAlimentToList = async (list_id, aliment_id) => {
  const response = await customFetch({
    method: "GET",
    uri: API_ROOT_EXTERNAL + `/lists/${list_id}/aliments/${aliment_id}`,
  });

  return response;
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

const AlimentCreationFormPresenter = ({ label, description, onLabelChange, onDescriptionChange, onSubmit }) => {
  return (
    <div>
      <h3>Ajouter un aliment</h3>
      <table>
        <tbody>
        <tr>
            <td>Label:</td>
            <td><input type="text" name={label} value={label} onChange={onLabelChange} /></td>
          </tr>
          <tr>
            <td>Description:</td>
            <td><input type="text" name={description} value={description} onChange={onDescriptionChange} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={onSubmit}>Créer</button>
    </div>
  )
}
const AlimentSearchForm = ({ data }) => {
  // TODO
}

const AlimentCreationForm = ({ data }) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

// TODO validate onLabelChange
  const onLabelChange = (e) => setLabel(e.target.value);
// TODO validate onDescriptionChange
  const onDescriptionChange = (e) => setDescription(e.target.value);
  const onSubmit = () => {
    (async () => {
      await createAliment(label, description);
// TODO handle request failure, for example if aliment already exists
      setLabel("");
      setDescription("");
    })();
  };

  return <AlimentCreationFormPresenter
    label={label}
    description={description}
    onLabelChange={onLabelChange}
    onDescriptionChange={onDescriptionChange}
    onSubmit={onSubmit}
  />
}

const View = ({ data }) => {
  if (!data?.name) {
    return (
      <div>
        <h2>Non connecté</h2>
      </div>
    );
  }

  return (
    <>
      <AlimentCreationForm />
    </>
  )
;
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
        <title>Listes de courses partagées</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Listes de courses partagées</h1>
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
