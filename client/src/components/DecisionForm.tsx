import React, { useEffect, useState } from 'react';
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
  IonIcon,
} from '@ionic/react';
import { checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { API_BASE_URL, getErrorMessage, getTerms, type Term } from '../api';
import './DecisionForm.css';

// Define the TypeScript interfaces for props
interface DecisionFormProps {
  applicationId: string;
  applicationTermId: string;
  currentStatus?: 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | null;
  currentDecisionDate?: string | null; // Expects ISO string (YYYY-MM-DD)
  currentWaitlistUntilTermId?: string | null;
  onSuccess?: () => void; // Optional callback to trigger a refresh on the parent list
}

const DecisionForm: React.FC<DecisionFormProps> = ({
  applicationId,
  applicationTermId,
  currentStatus = null,
  currentDecisionDate = '',
  currentWaitlistUntilTermId = '',
  onSuccess,
}) => {
  // Form state
  const [status, setStatus] = useState<'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | ''>(currentStatus || '');
  const [decisionDate, setDecisionDate] = useState<string>(
    currentDecisionDate ? currentDecisionDate.split('T')[0] : '',
  );
  const [waitlistSemester, setWaitlistSemester] = useState('');
  const [waitlistYear, setWaitlistYear] = useState<number | ''>('');
  const [terms, setTerms] = useState<Term[]>([]);
  const applicationTerm = terms.find((term) => term.id === applicationTermId);
  const availableWaitlistTerms = applicationTerm
    ? terms.filter((term) => {
        if (term.academicYear > applicationTerm.academicYear) {
          return true;
        }

        return (
          term.academicYear === applicationTerm.academicYear &&
          applicationTerm.name === 'Spring' &&
          term.name === 'Fall'
        );
      })
    : [];
  const availableYears = [
    ...new Set(availableWaitlistTerms.map((term) => term.academicYear)),
  ]
    .sort((firstYear, secondYear) => firstYear - secondYear);
  const waitlistUntilTermId =
    availableWaitlistTerms.find(
      (term) =>
        term.name === waitlistSemester &&
        term.academicYear === waitlistYear,
    )?.id ?? '';

  // UI state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const termOptions = await getTerms();
        setTerms(termOptions);

        const currentWaitlistTerm = termOptions.find(
          (term) => term.id === currentWaitlistUntilTermId,
        );

        if (currentWaitlistTerm) {
          setWaitlistSemester(currentWaitlistTerm.name);
          setWaitlistYear(currentWaitlistTerm.academicYear);
        }
      } catch (loadError) {
        setError(
          getErrorMessage(loadError, 'Failed to load semester choices.'),
        );
      }
    };

    void loadTerms();
  }, [currentWaitlistUntilTermId]);

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
    if (status === 'WAITLISTED' && !waitlistUntilTermId) {
      setError('Please select the semester the waitlist lasts until.');
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
          waitlistUntilTermId:
            status === 'WAITLISTED' ? waitlistUntilTermId : null,
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
      setError(getErrorMessage(error, 'Failed to save the decision.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonCard className="decision-form-card">
      <IonCardHeader className="decision-form-header">
        <IonCardTitle>Update decision status</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <form onSubmit={handleSubmit}>
          {/* Status Selection - Using modern Ionic v8 Inline Label syntax */}
          <IonItem className="decision-form-field" lines="none">
            <IonSelect
              label="Admission Status"
              labelPlacement="stacked"
              value={status}
              placeholder="Select Status"
              onIonChange={(event) => {
                const selectedStatus = event.detail.value;
                setStatus(selectedStatus);

                if (selectedStatus !== 'WAITLISTED') {
                  setWaitlistSemester('');
                  setWaitlistYear('');
                }
              }}
              disabled={submitting}
              className="custom-select"
            >
              <IonSelectOption value="ACCEPTED">Accepted</IonSelectOption>
              <IonSelectOption value="REJECTED">Rejected</IonSelectOption>
              <IonSelectOption value="WAITLISTED">Waitlisted</IonSelectOption>
            </IonSelect>
          </IonItem>

          {status === 'WAITLISTED' && (
            <>
              <IonItem className="decision-form-field" lines="none">
                <IonSelect
                  label="Waitlisted Until Semester"
                  labelPlacement="stacked"
                  value={waitlistSemester}
                  placeholder="Select Semester"
                  onIonChange={(event) =>
                    setWaitlistSemester(event.detail.value)
                  }
                  disabled={submitting}
                >
                  <IonSelectOption value="Spring">Spring</IonSelectOption>
                  <IonSelectOption value="Fall">Fall</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="decision-form-field" lines="none">
                <IonSelect
                  label="Waitlisted Until Year"
                  labelPlacement="stacked"
                  value={waitlistYear}
                  placeholder="Select Year"
                  onIonChange={(event) =>
                    setWaitlistYear(Number(event.detail.value))
                  }
                  disabled={submitting}
                >
                  {availableYears.map((year) => (
                    <IonSelectOption key={year} value={year}>
                      {year}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </>
          )}

          {/* Decision Date Picker - Using modern Ionic v8 Inline Label syntax */}
          <IonItem className="decision-form-field" lines="none">
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
            className="decision-form-submit"
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
