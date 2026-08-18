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
import { getErrorMessage, registerAccount } from '../api';
import { saveAuthSession } from '../authSession';
import './SignUp.css';

const SignUp: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerAccount({ username, password });
      saveAuthSession(response.token, response.user);
      history.push('/');
    } catch (registerError) {
      setError(getErrorMessage(registerError, 'Unable to create the account.'));
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
              <IonCardTitle>Create your account</IonCardTitle>
              <IonCardSubtitle>
                Start tracking your graduate applications and decisions.
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
            <form className="auth-form" onSubmit={handleRegister}>
              <IonItem>
                <IonInput
                  label="Username"
                  labelPlacement="stacked"
                  value={username}
                  minlength={3}
                  maxlength={50}
                  helperText="Use letters, numbers, or underscores."
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
                  helperText="Use at least 8 characters."
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
                  {loading ? <IonSpinner name="crescent" /> : 'Create account'}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  type="button"
                  routerLink="/login"
                >
                  Already have an account? Log in
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

export default SignUp;
