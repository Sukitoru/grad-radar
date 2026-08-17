import { useEffect, useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
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
import {
  getErrorMessage,
  getRecentDecisions,
  type RecentDecision,
} from '../api';
import HeaderActions from '../components/HeaderActions';
import './RecentDecisionsPage.css';

const RecentDecisionsPage: React.FC = () => {
  const decisionsPerPage = 10;
  const [decisions, setDecisions] = useState<RecentDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadRecentDecisions = async () => {
      try {
        setDecisions(await getRecentDecisions());
        setError('');
      } catch (loadError) {
        setError(
          getErrorMessage(loadError, 'Failed to load recent decisions.'),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRecentDecisions();

    const pollingInterval = window.setInterval(() => {
      void loadRecentDecisions();
    }, 30_000);

    return () => window.clearInterval(pollingInterval);
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

  const filteredDecisions = decisions.filter((decision) => {
    const searchValue = searchText.toLowerCase();
    const schoolName = decision.application.school.name.toLowerCase();
    const programName = decision.application.program.name.toLowerCase();
    const matchesSearch =
      schoolName.includes(searchValue) || programName.includes(searchValue);
    const matchesDecision =
      decisionFilter === 'ALL' || decision.status === decisionFilter;

    return matchesSearch && matchesDecision;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDecisions.length / decisionsPerPage),
  );
  const firstDecisionIndex = (currentPage - 1) * decisionsPerPage;
  const visibleDecisions = filteredDecisions.slice(
    firstDecisionIndex,
    firstDecisionIndex + decisionsPerPage,
  );

  const updateSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const updateDecisionFilter = (value: string) => {
    setDecisionFilter(value);
    setCurrentPage(1);
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

        {!loading && !error && decisions.length > 0 && (
          <>
          <p className="recent-decision-summary">
            Search the 100 most recent decisions. Use Analytics to view trends
            across all submissions.
          </p>
          <div className="recent-decision-controls">
            <IonSearchbar
              className="recent-decision-search"
              value={searchText}
              placeholder="Search by school or program"
              onIonInput={(event) =>
                updateSearch(String(event.detail.value ?? ''))
              }
            />

            <IonItem className="recent-decision-filter" lines="none">
              <IonSelect
                label="Decision"
                value={decisionFilter}
                interface="popover"
                onIonChange={(event) =>
                  updateDecisionFilter(event.detail.value)
                }
              >
                <IonSelectOption value="ALL">All decisions</IonSelectOption>
                <IonSelectOption value="ACCEPTED">Accepted</IonSelectOption>
                <IonSelectOption value="REJECTED">Rejected</IonSelectOption>
                <IonSelectOption value="WAITLISTED">Waitlisted</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
          </>
        )}

        {!loading && !error && decisions.length === 0 && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              No decisions have been recorded yet.
            </IonCardContent>
          </IonCard>
        )}

        {!loading &&
          !error &&
          decisions.length > 0 &&
          filteredDecisions.length === 0 && (
            <IonCard>
              <IonCardContent className="ion-text-center">
                No decisions match your search or filter.
              </IonCardContent>
            </IonCard>
          )}

        <div className="recent-decision-grid">
          {visibleDecisions.map((decision) => (
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
                  className={`recent-decision-status recent-decision-status-${decision.status.toLowerCase()}`}
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

              <div className="recent-decision-research-area">
                <span className="recent-decision-label">Research area</span>
                <span className="recent-decision-value">
                  {decision.application.researchArea ?? 'Not listed'}
                </span>
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
                    <IonIcon icon={hourglassOutline} />
                    <div>
                      <span className="recent-decision-label">
                        Waitlist period
                      </span>
                      <strong>
                        Through {decision.waitlistUntilTerm.name}{' '}
                        {decision.waitlistUntilTerm.academicYear}
                      </strong>
                    </div>
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
        </div>

        {!loading && !error && filteredDecisions.length > 0 && (
          <div className="recent-decision-pagination">
            <IonButton
              fill="outline"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </IonButton>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <IonButton
              fill="outline"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecentDecisionsPage;
