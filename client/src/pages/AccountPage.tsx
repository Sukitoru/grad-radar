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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline, saveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getErrorMessage, getUserProfile, updateUserProfile } from '../api';
import { awardOptions, maximumAwards } from '../awardOptions';
import HeaderActions from '../components/HeaderActions';
import './FormPages.css';

const AccountPage: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [gpa, setGpa] = useState('');
  const [awards, setAwards] = useState<string[]>([]);
  const [publications, setPublications] = useState('0');
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
        setAwards(profile.defaultAwards);
        setPublications(String(profile.defaultPublications));
      } catch (loadError) {
        setError(
          getErrorMessage(loadError, 'Failed to load the account profile.'),
        );
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
        defaultAwards: awards,
        defaultPublications: publications ? Number(publications) : 0,
      });
      setMessage('Account profile saved.');
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, 'Failed to save the account profile.'),
      );
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
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="form-page-container">
          <header className="form-page-heading">
            <span className="form-page-label">Account profile</span>
            <h1>Account settings</h1>
            <p>
              Save information that can be copied into new application forms.
            </p>
          </header>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading account...</p>
          </div>
        ) : (
          <form className="form-page-form" onSubmit={handleSave}>
            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>01</span>
                <div>
                  <h2>Account</h2>
                  <p>Update the name shown on your account.</p>
                </div>
              </div>
              <IonList className="form-page-fields">
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
            </section>

            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>02</span>
                <div>
                  <h2>Application defaults</h2>
                  <p>Use these values to fill new applications faster.</p>
                </div>
              </div>
              <IonList className="form-page-fields form-page-fields-three-column">
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
                <IonSelect
                  label="Awards"
                  labelPlacement="stacked"
                  placeholder="Select up to 5 awards"
                  multiple={true}
                  value={awards}
                  onIonChange={(event) => {
                    const selectedAwards = event.detail.value as string[];

                    if (selectedAwards.length <= maximumAwards) {
                      setAwards(selectedAwards);
                      setError('');
                    } else {
                      setError(`Select no more than ${maximumAwards} awards.`);
                    }
                  }}
                >
                  {awardOptions.map((award) => (
                    <IonSelectOption key={award} value={award}>
                      {award}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  label="Number of Publications"
                  labelPlacement="stacked"
                  value={publications}
                  onIonInput={(event) =>
                    setPublications(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              </IonList>
            </section>

            {message && <IonNote className="form-page-note" color="success">{message}</IonNote>}
            {error && <IonNote className="form-page-note" color="danger">{error}</IonNote>}

            <div className="form-page-actions">
            <IonButton
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
              fill="outline"
              color="danger"
              type="button"
              onClick={handleLogout}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Log Out
            </IonButton>
            </div>
          </form>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
