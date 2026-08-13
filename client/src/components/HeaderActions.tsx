import { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonIcon, IonToggle } from '@ionic/react';
import { moonOutline, personCircleOutline } from 'ionicons/icons';

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
    <IonButtons slot="end">
      <IonIcon icon={moonOutline} aria-hidden="true" />
      <IonToggle
        aria-label="Toggle dark mode"
        checked={darkMode}
        onIonChange={(event) => setDarkMode(event.detail.checked)}
      />
      <IonButton routerLink="/account" aria-label="Open account">
        <IonIcon slot="icon-only" icon={personCircleOutline} />
      </IonButton>
    </IonButtons>
  );
};

export default HeaderActions;
