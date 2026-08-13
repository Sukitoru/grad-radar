import { useEffect, useState } from 'react';
import {
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  hourglassOutline,
  schoolOutline,
} from 'ionicons/icons';
import { getRecentDecisions, type RecentDecision } from '../api';
import HeaderActions from '../components/HeaderActions';
import './RecentDecisionsPage.css';

const RecentDecisionsPage: React.FC = () => {
  const [decisions, setDecisions] = useState<RecentDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecentDecisions = async () => {
      try {
        setDecisions(await getRecentDecisions());
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load recent decisions.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadRecentDecisions();
  }, []);

  const getStatusIcon = (status: RecentDecision['status']) => {
    if (status === 'ACCEPTED') {
      return checkmarkCircleOutline;
    }

    if (status === 'REJECTED') {
      return closeCircleOutline;
    }

    return hourglassOutline;
  };

  const getStatusColor = (status: RecentDecision['status']) => {
    if (status === 'ACCEPTED') {
      return 'success';
    }

    if (status === 'REJECTED') {
      return 'danger';
    }

    return 'warning';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Recent Decisions</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading recent decisions...</p>
          </div>
        )}

        {error && (
          <IonCard color="danger">
            <IonCardContent>{error}</IonCardContent>
          </IonCard>
        )}

        {!loading && !error && decisions.length === 0 && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              No decisions have been recorded yet.
            </IonCardContent>
          </IonCard>
        )}

        {decisions.map((decision) => (
          <IonCard key={decision.id} className="recent-decision-card">
            <IonCardHeader className="recent-decision-header">
              <div className="recent-decision-heading">
                <div>
                  <IonCardTitle className="recent-decision-school">
                    <IonIcon icon={schoolOutline} color="secondary" />
                    {decision.application.school.name}
                  </IonCardTitle>
                  <IonCardSubtitle className="recent-decision-program">
                    {decision.application.program.degreeLevel} in{' '}
                    {decision.application.program.name}
                  </IonCardSubtitle>
                </div>

                <IonBadge
                  className="recent-decision-status"
                  color={getStatusColor(decision.status)}
                >
                  <IonIcon icon={getStatusIcon(decision.status)} />{' '}
                  {decision.status}
                </IonBadge>
              </div>
            </IonCardHeader>

            <IonCardContent>
              <div className="recent-decision-details">
                <div className="recent-decision-detail recent-decision-term">
                  <span className="recent-decision-value">
                    {decision.application.term.name}{' '}
                    {decision.application.term.academicYear}
                  </span>
                </div>

                <div className="recent-decision-detail">
                  <span className="recent-decision-value">
                    {decision.application.gpa === null
                      ? 'GPA not listed'
                      : `GPA ${Number(decision.application.gpa).toFixed(2)}`}
                  </span>
                </div>

                <div className="recent-decision-detail">
                  <span className="recent-decision-value">
                    {decision.application.publications.toLocaleString()}{' '}
                    {decision.application.publications === 1
                      ? 'publication'
                      : 'publications'}
                  </span>
                </div>

                {decision.application.awards.length === 0 ? (
                  <div className="recent-decision-detail">
                    <span className="recent-decision-value">No awards</span>
                  </div>
                ) : (
                  decision.application.awards.map((award) => (
                    <div
                      key={award}
                      className="recent-decision-detail recent-decision-award"
                    >
                      <span className="recent-decision-value">{award}</span>
                    </div>
                  ))
                )}

                {decision.status === 'WAITLISTED' &&
                  decision.waitlistUntilTerm && (
                    <div className="recent-decision-detail">
                      <span className="recent-decision-value">
                        Until{' '}
                        {decision.waitlistUntilTerm.name}{' '}
                        {decision.waitlistUntilTerm.academicYear}
                      </span>
                    </div>
                  )}
              </div>

              <div className="recent-decision-comments">
                <span className="recent-decision-label">Comments</span>
                <p>
                  {decision.application.comments ?? 'No comments added'}
                </p>
              </div>

              <div className="recent-decision-dates">
                <span>
                  <strong>Decision received:</strong>{' '}
                  {new Date(decision.decisionDate).toLocaleDateString()}
                </span>
                <span>
                  <strong>Added on:</strong>{' '}
                  {new Date(decision.createdAt).toLocaleDateString()}
                </span>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default RecentDecisionsPage;
