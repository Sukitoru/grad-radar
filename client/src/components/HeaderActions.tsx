import { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonSpinner,
} from '@ionic/react';
import {
  logInOutline,
  logOutOutline,
  moonOutline,
  personCircleOutline,
  personOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getErrorMessage, loginAccount } from '../api';
import {
  clearAuthSession,
  getAuthenticatedUser,
  isAuthenticated,
  saveAuthSession,
} from '../authSession';
import './HeaderActions.css';

const DARK_MODE_KEY = 'grad-radar-dark-mode';

const HeaderActions: React.FC = () => {
  const history = useHistory();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(DARK_MODE_KEY) === 'true',
  );
  const [signedIn, setSignedIn] = useState(isAuthenticated());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('ion-palette-dark', darkMode);
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const response = await loginAccount({ username, password });
      saveAuthSession(response.token, response.user);
      setSignedIn(true);
      setPassword('');
      setPopoverOpen(false);
    } catch (error) {
      setLoginError(getErrorMessage(error, 'Unable to log in.'));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setSignedIn(false);
    setPopoverOpen(false);
    history.replace('/');
  };

  const openPage = (path: string) => {
    setPopoverOpen(false);
    history.push(path);
  };

  return (
    <IonButtons slot="end" className="header-actions">
      <IonButton
        className="header-action-button"
        aria-label={darkMode ? 'Use light mode' : 'Use dark mode'}
        onClick={() => setDarkMode(!darkMode)}
      >
        <IonIcon
          slot="icon-only"
          icon={darkMode ? sunnyOutline : moonOutline}
        />
      </IonButton>

      <IonButton
        className="header-action-button"
        aria-label={signedIn ? 'Open account menu' : 'Open login menu'}
        aria-expanded={popoverOpen}
        onClick={(event) => {
          setPopoverEvent(event.nativeEvent);
          setPopoverOpen((isOpen) => !isOpen);
        }}
      >
        <IonIcon slot="icon-only" icon={personCircleOutline} />
      </IonButton>

      <IonPopover
        isOpen={popoverOpen}
        event={popoverEvent}
        onDidDismiss={() => setPopoverOpen(false)}
        className="account-popover"
      >
        {signedIn ? (
          <IonList lines="none" className="account-menu-list">
            <IonItem>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel>
                <strong>{getAuthenticatedUser()?.username}</strong>
                <p>Signed in</p>
              </IonLabel>
            </IonItem>
            <IonItem button onClick={() => openPage('/account')}>
              <IonIcon slot="start" icon={personCircleOutline} />
              <IonLabel>Account settings</IonLabel>
            </IonItem>
            <IonItem button onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Log out</IonLabel>
            </IonItem>
          </IonList>
        ) : (
          <form className="header-login-form" onSubmit={handleLogin}>
            <div>
              <span className="header-login-label">Account</span>
              <h2>Log in to Grad Radar</h2>
            </div>

            <IonInput
              label="Username"
              labelPlacement="stacked"
              fill="outline"
              value={username}
              onIonInput={(event) =>
                setUsername(String(event.detail.value ?? ''))
              }
              required
            />
            <IonInput
              label="Password"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              value={password}
              onIonInput={(event) =>
                setPassword(String(event.detail.value ?? ''))
              }
              required
            />

            {loginError && <IonNote color="danger">{loginError}</IonNote>}

            <IonButton type="submit" expand="block" disabled={loggingIn}>
              {loggingIn ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon slot="start" icon={logInOutline} />
                  Log in
                </>
              )}
            </IonButton>

            <div className="header-login-links">
              <IonButton fill="clear" onClick={() => openPage('/login')}>
                Full login page
              </IonButton>
              <IonButton fill="clear" onClick={() => openPage('/signup')}>
                Register
              </IonButton>
            </div>
          </form>
        )}
      </IonPopover>
    </IonButtons>
  );
};

export default HeaderActions;
