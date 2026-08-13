import { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline, saveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api';

const AccountPage: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [gpa, setGpa] = useState('');
  const [awards, setAwards] = useState('');
  const [publications, setPublications] = useState('0');
  const [publicationLinks, setPublicationLinks] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

      if (!demoUserId) {
        setError('VITE_DEMO_USER_ID is required for the local demo.');
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(demoUserId);

        setUsername(profile.username);
        setGpa(profile.defaultGpa === null ? '' : String(profile.defaultGpa));
        setAwards(profile.defaultAwards ?? '');
        setPublications(String(profile.defaultPublications));
        setPublicationLinks(profile.defaultPublicationLinks ?? '');
      } catch (loadError) {
        const loadMessage =
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load the account profile.';
        setError(loadMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

    if (!demoUserId) {
      setError('VITE_DEMO_USER_ID is required for the local demo.');
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(demoUserId, {
        username,
        defaultGpa: gpa ? Number(gpa) : null,
        defaultAwards: awards || null,
        defaultPublications: publications ? Number(publications) : 0,
        defaultPublicationLinks: publicationLinks || null,
      });
      setMessage('Account profile saved.');
    } catch (saveError) {
      const saveMessage =
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save the account profile.';
      setError(saveMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    history.push('/');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Account Settings</h1>
        <p>
          Save information that can be copied into new application forms.
        </p>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading account...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <h2>Account</h2>
            <IonList>
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
            </IonList>

            <h2>Application Defaults</h2>
            <IonList>
              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  label="GPA"
                  labelPlacement="stacked"
                  value={gpa}
                  onIonInput={(event) =>
                    setGpa(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonTextarea
                  label="Awards"
                  labelPlacement="stacked"
                  placeholder="List any awards or honors"
                  autoGrow={true}
                  value={awards}
                  onIonInput={(event) =>
                    setAwards(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  label="Number of Publications"
                  labelPlacement="stacked"
                  value={publications}
                  onIonInput={(event) =>
                    setPublications(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonTextarea
                  label="Publication Links"
                  labelPlacement="stacked"
                  placeholder="Add one link per line"
                  autoGrow={true}
                  value={publicationLinks}
                  onIonInput={(event) =>
                    setPublicationLinks(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>
            </IonList>

            {message && <IonNote color="success">{message}</IonNote>}
            {error && <IonNote color="danger">{error}</IonNote>}

            <IonButton
              className="ion-margin-top"
              expand="block"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon slot="start" icon={saveOutline} />
                  Save Account
                </>
              )}
            </IonButton>

            <IonButton
              className="ion-margin-top"
              expand="block"
              fill="outline"
              color="danger"
              type="button"
              onClick={handleLogout}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Log Out
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
