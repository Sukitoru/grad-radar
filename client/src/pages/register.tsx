import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon,
  useIonRouter
} from '@ionic/react';
import { personAddOutline, lockClosedOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import api from '../api'; // Centralized api request helper we built earlier

const RegisterPage: React.FC = () => {
  const router = useIonRouter();

  // Form input states
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // UI state tracking
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Form client-side validation
  const validateForm = (): boolean => {
    setError(null);

    if (!username.trim()) {
      setError('Username is required.');
      return false;
    }
    
    // Check username length (matches Zod schema)
    if (username.length < 3 || username.length > 50) {
      setError('Username must be between 3 and 50 characters.');
      return false;
    }

    // RegEx checking for alphanumeric (matches Zod schema)
    const alphanumericRegex = /^[a-zA-Z0-9_]+$/;
    if (!alphanumericRegex.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return false;
    }

    if (!password) {
      setError('Password is required.');
      return false;
    }

    // Check password length (matches Zod schema)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      // POST registration data using our shared helper
      const response = await api.post<{ token: string; user: { id: string; username: string } }>(
        '/auth/register',
        { username, password }
      );

      // Save token to localStorage so our api-helper automatically appends the auth header next time
      localStorage.setItem('auth_token', response.token);
      
      setSuccess(true);
      setError(null);

      // Brief delay to allow the user to see the success state, then redirect to home/dashboard
      setTimeout(() => {
        router.push('/home', 'forward', 'replace');
      }, 1500);

    } catch (err: any) {
      // The API helper already extracts backend/validation error messages cleanly
      setError(err.message || 'Registration failed. Please try a different username.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding ion-justify-content-center ion-align-items-center">
        <div style={{ maxWidth: '450px', margin: '40px auto' }}>
          <div className="ion-text-center ion-padding-bottom">
            <IonIcon icon={personAddOutline} style={{ fontSize: '64px', color: 'var(--ion-color-primary)' }} />
            <h2>Welcome to GradRadar</h2>
            <p style={{ color: 'var(--ion-color-step-600)' }}>
              Create a pseudonymous account to track your applications anonymously.
            </p>
          </div>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Sign Up</IonCardTitle>
              <IonCardSubtitle>No email or real names required</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleRegister}>
                {/* Username Input using modern Ionic v8 inline labels */}
                <IonItem className="ion-margin-bottom" lines="none" style={{ borderRadius: '8px', border: '1px solid var(--ion-color-light)' }}>
                  <IonInput
                    label="Pseudonymous Username"
                    labelPlacement="stacked"
                    type="text"
                    placeholder="e.g., CyberResearcher_42"
                    value={username}
                    onIonInput={(e) => setUsername(e.detail.value || '')}
                    disabled={submitting || success}
                  />
                </IonItem>

                {/* Password Input */}
                <IonItem className="ion-margin-bottom" lines="none" style={{ borderRadius: '8px', border: '1px solid var(--ion-color-light)' }}>
                  <IonInput
                    label="Password"
                    labelPlacement="stacked"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                    disabled={submitting || success}
                  />
                </IonItem>

                {/* Confirm Password Input */}
                <IonItem className="ion-margin-bottom" lines="none" style={{ borderRadius: '8px', border: '1px solid var(--ion-color-light)' }}>
                  <IonInput
                    label="Confirm Password"
                    labelPlacement="stacked"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
                    disabled={submitting || success}
                  />
                </IonItem>

                {/* Error Box */}
                {error && (
                  <div className="ion-padding-vertical">
                    <IonText color="danger" className="ion-flex ion-align-items-center">
                      <IonIcon icon={alertCircleOutline} style={{ marginRight: '8px', fontSize: '20px' }} />
                      <strong>{error}</strong>
                    </IonText>
                  </div>
                )}

                {/* Success Box */}
                {success && (
                  <div className="ion-padding-vertical">
                    <IonText color="success" className="ion-flex ion-align-items-center">
                      <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '8px', fontSize: '20px' }} />
                      <strong>Account created! Redirecting to tracker...</strong>
                    </IonText>
                  </div>
                )}

                {/* Submit button */}
                <IonButton
                  expand="block"
                  type="submit"
                  disabled={submitting || success}
                  className="ion-margin-top"
                >
                  {submitting ? (
                    <>
                      <IonSpinner name="crescent" size="small" style={{ marginRight: '8px' }} />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </IonButton>
              </form>

              {/* Navigation link to sign-in page */}
              <div className="ion-text-center ion-margin-top ion-padding-top" style={{ borderTop: '1px solid var(--ion-color-light)' }}>
                <IonText color="medium">Already have an account? </IonText>
                <IonButton fill="clear" size="small" onClick={() => router.push('/login', 'forward')}>
                  Sign In
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
