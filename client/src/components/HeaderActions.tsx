import { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonIcon } from '@ionic/react';
import {
  moonOutline,
  personCircleOutline,
  sunnyOutline,
} from 'ionicons/icons';
import './HeaderActions.css';

const DARK_MODE_KEY = 'grad-radar-dark-mode';

const HeaderActions: React.FC = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(DARK_MODE_KEY) === 'true',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('ion-palette-dark', darkMode);
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

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
        routerLink="/account"
        aria-label="Open account"
      >
        <IonIcon slot="icon-only" icon={personCircleOutline} />
      </IonButton>
    </IonButtons>
  );
};

export default HeaderActions;
