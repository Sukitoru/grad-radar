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
                    <IonIcon icon={schoolOutline} color="medium" />
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
                  {decision.status.charAt(0) +
                    decision.status.slice(1).toLowerCase()}
                </IonBadge>
              </div>
            </IonCardHeader>

            <IonCardContent>
              <div className="recent-decision-facts">
                <div className="recent-decision-fact">
                  <span className="recent-decision-label">Term</span>
                  <span className="recent-decision-value">
                    {decision.application.term.name}{' '}
                    {decision.application.term.academicYear}
                  </span>
                </div>

                <div className="recent-decision-fact">
                  <span className="recent-decision-label">GPA</span>
                  <span className="recent-decision-value">
                    {decision.application.gpa === null
                      ? 'Not listed'
                      : Number(decision.application.gpa).toFixed(2)}
                  </span>
                </div>

                <div className="recent-decision-fact">
                  <span className="recent-decision-label">Publications</span>
                  <span className="recent-decision-value">
                    {decision.application.publications.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="recent-decision-awards-row">
                <span className="recent-decision-label">Awards</span>
                <div className="recent-decision-awards-list">
                {decision.application.awards.length === 0 ? (
                  <span className="recent-decision-empty-value">None listed</span>
                ) : (
                  decision.application.awards.map((award) => (
                    <span
                      key={award}
                      className="recent-decision-award-tag"
                    >
                      {award}
                    </span>
                  ))
                )}
                </div>
              </div>

              {decision.status === 'WAITLISTED' &&
                decision.waitlistUntilTerm && (
                  <div className="recent-decision-waitlist">
                    Waitlisted until {decision.waitlistUntilTerm.name}{' '}
                    {decision.waitlistUntilTerm.academicYear}
                  </div>
                )}

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
