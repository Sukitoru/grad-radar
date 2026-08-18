import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonNote,
  IonPage,
  IonSpinner,
} from '@ionic/react';
import { schoolOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getErrorMessage, loginAccount } from '../api';
import { saveAuthSession, takeRequestedPath } from '../authSession';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAccount({ username, password });
      saveAuthSession(response.token, response.user);
      history.replace(takeRequestedPath() ?? '/');
    } catch (loginError) {
      setError(getErrorMessage(loginError, 'Unable to log in.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="auth-page">
        <main className="auth-page-layout">
          <IonCard className="auth-card">
            <IonCardHeader>
              <div className="auth-brand">
                <IonIcon icon={schoolOutline} />
                <span>Grad Radar</span>
              </div>
              <IonCardTitle>Welcome back</IonCardTitle>
              <IonCardSubtitle>
                Log in to manage your graduate applications.
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
            <form className="auth-form" onSubmit={handleLogin}>
              <IonItem>
                <IonInput
                  label="Username"
                  labelPlacement="stacked"
                  value={username}
                  minlength={3}
                  maxlength={50}
                  onIonInput={(event) =>
                    setUsername(String(event.detail.value ?? ''))
                  }
                  required
                />
              </IonItem>

              <IonItem>
                <IonInput
                  label="Password"
                  labelPlacement="stacked"
                  type="password"
                  value={password}
                  minlength={8}
                  maxlength={100}
                  onIonInput={(event) =>
                    setPassword(String(event.detail.value ?? ''))
                  }
                  required
                />
              </IonItem>

              {error && (
                <IonNote className="error-message" color="danger">
                  {error}
                </IonNote>
              )}

              <div className="auth-form-actions">
                <IonButton expand="block" type="submit" disabled={loading}>
                  {loading ? <IonSpinner name="crescent" /> : 'Log in'}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  type="button"
                  routerLink="/signup"
                >
                  Create an account
                </IonButton>
              </div>
            </form>
            <div className="auth-home-link">
              <IonButton fill="clear" routerLink="/">
                Return to the landing page
              </IonButton>
            </div>
            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Login;
