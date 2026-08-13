import { useEffect, useState } from 'react';
import {
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
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

const getValidPublicationLinks = (publicationLinks: string | null) =>
  publicationLinks
    ?.split('\n')
    .map((link) => link.trim())
    .filter((link) => link.startsWith('https://') || link.startsWith('http://')) ?? [];

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
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Recent Decisions</IonTitle>
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
          <IonCard key={decision.id}>
            <IonCardContent>
              <h2>
                <IonIcon icon={schoolOutline} />{' '}
                {decision.application.school.name}
              </h2>
              <p>
                {decision.application.program.degreeLevel} in{' '}
                {decision.application.program.name}
              </p>
              <p>
                {decision.application.term.name}{' '}
                {decision.application.term.academicYear}
              </p>
              <p>
                <strong>GPA:</strong>{' '}
                {decision.application.gpa ?? 'Not listed'}
              </p>
              <p>
                <strong>Research area:</strong>{' '}
                {decision.application.researchArea ?? 'Not listed'}
              </p>
              <p>
                <strong>Awards:</strong>{' '}
                {decision.application.awards ?? 'None listed'}
              </p>
              <p>
                <strong>Publications:</strong>{' '}
                {decision.application.publications}
              </p>
              {getValidPublicationLinks(decision.application.publicationLinks).length > 0 && (
                <div>
                  <strong>Publication links:</strong>
                  <ul>
                    {getValidPublicationLinks(decision.application.publicationLinks).map(
                      (link, index) => (
                        <li key={`${link}-${index}`}>
                          <a href={link} target="_blank" rel="noreferrer">
                            Publication {index + 1}
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
              <p>
                <strong>Comments:</strong>{' '}
                {decision.application.comments ?? 'No comments added'}
              </p>
              <IonBadge color={getStatusColor(decision.status)}>
                <IonIcon icon={getStatusIcon(decision.status)} />{' '}
                {decision.status}
              </IonBadge>
              <p>
                Decision received:{' '}
                {new Date(decision.decisionDate).toLocaleDateString()}
              </p>
              <p>
                Added to Grad Radar:{' '}
                {new Date(decision.createdAt).toLocaleString()}
              </p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default RecentDecisionsPage;
