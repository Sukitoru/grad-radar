import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon
} from '@ionic/react';
import { checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { API_BASE_URL } from '../api';

// Define the TypeScript interfaces for props
interface DecisionFormProps {
  applicationId: string;
  currentStatus?: 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | null;
  currentDecisionDate?: string | null; // Expects ISO string (YYYY-MM-DD)
  onSuccess?: () => void; // Optional callback to trigger a refresh on the parent list
}

const DecisionForm: React.FC<DecisionFormProps> = ({
  applicationId,
  currentStatus = null,
  currentDecisionDate = '',
  onSuccess
}) => {
  // Form state
  const [status, setStatus] = useState<'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | ''>(currentStatus || '');
  const [decisionDate, setDecisionDate] = useState<string>(
    currentDecisionDate ? currentDecisionDate.split('T')[0] : ''
  );

  // UI state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Validate inputs
  const validateForm = (): boolean => {
    if (!status) {
      setError('Please select an admission status.');
      return false;
    }
    if (!decisionDate) {
      setError('Please select the date the decision was received.');
      return false;
    }

    const selectedDate = new Date(decisionDate);
    const today = new Date();
    // Zero out times for accurate date-only comparison
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setError('Decision date cannot be in the future.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      // API call to the backend PUT endpoint
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/decision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          decisionDate: new Date(decisionDate).toISOString(), // Convert to UTC ISO format
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save decision.');
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess(); // Trigger parent refresh (e.g. updating stats and lists)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle color="primary">Update Decision Status</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <form onSubmit={handleSubmit}>
          {/* Status Selection - Using modern Ionic v8 Inline Label syntax */}
          <IonItem className="ion-margin-bottom" lines="none">
            <IonSelect
              label="Admission Status"
              labelPlacement="stacked"
              value={status}
              placeholder="Select Status"
              onIonChange={(e) => setStatus(e.detail.value)}
              disabled={submitting}
              className="custom-select"
            >
              <IonSelectOption value="ACCEPTED">Accepted 🎉</IonSelectOption>
              <IonSelectOption value="REJECTED">Rejected</IonSelectOption>
              <IonSelectOption value="WAITLISTED">Waitlisted ⏳</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Decision Date Picker - Using modern Ionic v8 Inline Label syntax */}
          <IonItem className="ion-margin-bottom" lines="none">
            <IonInput
              label="Decision Date"
              labelPlacement="stacked"
              type="date"
              value={decisionDate}
              onIonInput={(e) => setDecisionDate(e.detail.value || '')}
              disabled={submitting}
            />
          </IonItem>

          {/* Error Banner */}
          {error && (
            <div className="ion-padding-bottom">
              <IonText color="danger" className="ion-flex ion-align-items-center">
                <IonIcon icon={alertCircleOutline} style={{ marginRight: '8px' }} />
                <span>{error}</span>
              </IonText>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="ion-padding-bottom">
              <IonText color="success" className="ion-flex ion-align-items-center">
                <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '8px' }} />
                <span>Decision updated successfully!</span>
              </IonText>
            </div>
          )}

          {/* Submit Button */}
          <IonButton
            expand="block"
            type="submit"
            disabled={submitting}
            className="ion-margin-top"
          >
            {submitting ? (
              <>
                <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                Saving...
              </>
            ) : (
              'Save Decision'
            )}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default DecisionForm;
