import React, { useState, useEffect } from 'react';
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
  IonList,
  IonItem,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
  IonModal,
  IonButtons,
  IonMenuButton,
  IonAlert,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import {
  schoolOutline,
  calendarOutline,
  ribbonOutline,
  checkmarkCircle,
  closeCircle,
  hourglassOutline,
  createOutline,
  statsChartOutline,
  trashOutline,
  addOutline,
} from 'ionicons/icons';
import { deleteApplication, getApplications, type Application } from '../api';
import DecisionForm from '../components/DecisionForm'; // Re-using our previously built form
import HeaderActions from '../components/HeaderActions';
import './ApplicationsPage.css';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');

  // Modal tracking states
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Application | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Fetch applications and their related school, program, term, and decision.
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

      if (!demoUserId) {
        throw new Error(
          'VITE_DEMO_USER_ID is missing from the client environment.',
        );
      }

      const applicationData = await getApplications();

      const userApplications = applicationData.filter(
        (application) => application.userId === demoUserId,
      );

      setApplications(userApplications);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve applications.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchApplications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleOpenDecisionModal = (appId: string) => {
    setSelectedAppId(appId);
    setIsModalOpen(true);
  };

  const handleDecisionSaveSuccess = () => {
    setIsModalOpen(false);
    setSelectedAppId(null);
    void fetchApplications();
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteApplication(applicationToDelete.id);
      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationToDelete.id,
        ),
      );
      setApplicationToDelete(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete the application.';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  // Generate the badge for an application's current decision.
  const renderDecisionBadge = (decision: Application['decision']) => {
    if (!decision) {
      return (
        <IonBadge
          className="application-status-badge"
          color="medium"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <IonIcon icon={hourglassOutline} />
          Pending
        </IonBadge>
      );
    }

    switch (decision.status) {
      case 'ACCEPTED':
        return (
          <IonBadge
            className="application-status-badge"
            color="success"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={checkmarkCircle} />
            Accepted
          </IonBadge>
        );
      case 'REJECTED':
        return (
          <IonBadge
            className="application-status-badge"
            color="danger"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={closeCircle} />
            Rejected
          </IonBadge>
        );
      case 'WAITLISTED':
        return (
          <IonBadge
            className="application-status-badge"
            color="warning"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={hourglassOutline} />
            Waitlisted
          </IonBadge>
        );
    }
  };

  // Calculate high-level stats for user analytics
  const totalApps = applications.length;
  const acceptedApps = applications.filter(
    (a) => a.decision?.status === 'ACCEPTED',
  ).length;
  const waitlistedApps = applications.filter(
    (a) => a.decision?.status === 'WAITLISTED',
  ).length;
  const pendingApps = applications.filter((a) => !a.decision).length;
  const selectedApplication = applications.find(
    (application) => application.id === selectedAppId,
  );
  const filteredApplications = applications.filter((application) => {
    const schoolName = application.school?.name.toLowerCase() ?? '';
    const programName = application.program?.name.toLowerCase() ?? '';
    const searchValue = searchText.toLowerCase();
    const applicationStatus = application.decision?.status ?? 'PENDING';

    const matchesSearch =
      schoolName.includes(searchValue) || programName.includes(searchValue);

    const matchesDecision =
      decisionFilter === 'ALL' || applicationStatus === decisionFilter;

    return matchesSearch && matchesDecision;
  });

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <div style={{ marginTop: '40%' }}>
            <IonSpinner name="crescent" />
            <p>Loading your applications...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>My Applications</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="applications-page-container">
        {error && (
          <IonCard color="danger">
            <IonCardContent>{error}</IonCardContent>
          </IonCard>
        )}

        <section className="applications-overview">
          <div className="applications-overview-heading">
            <div>
              <span className="applications-overview-label">
              <IonIcon icon={statsChartOutline} />
                Application overview
              </span>
              <h1>My applications</h1>
              <p>Review your applications and update admission decisions.</p>
            </div>

            <IonButton size="small" routerLink="/applications/new">
              <IonIcon slot="start" icon={addOutline} />
              Add application
            </IonButton>
          </div>

          <div className="application-metrics">
            <div className="application-metric">
              <strong>{totalApps}</strong>
              <span>Total</span>
            </div>
            <div className="application-metric">
              <strong>{acceptedApps}</strong>
              <span>Accepted</span>
            </div>
            <div className="application-metric">
              <strong>{waitlistedApps}</strong>
              <span>Waitlisted</span>
            </div>
            <div className="application-metric">
              <strong>{pendingApps}</strong>
              <span>Pending</span>
            </div>
          </div>
        </section>

        {/* Personal tracker list */}
        <div className="applications-list-heading">
          <h2>Tracked applications</h2>
          <span>{filteredApplications.length} shown</span>
        </div>

        {applications.length > 0 && (
          <div className="application-filters">
            <IonSearchbar
              className="application-search"
              value={searchText}
              placeholder="Search by school or program"
              onIonInput={(event) =>
                setSearchText(String(event.detail.value ?? ''))
              }
            />

            <IonItem className="application-filter-item" lines="none">
              <IonSelect
                label="Decision"
                value={decisionFilter}
                interface="popover"
                onIonChange={(event) => setDecisionFilter(event.detail.value)}
              >
                <IonSelectOption value="ALL">All decisions</IonSelectOption>
                <IonSelectOption value="PENDING">Pending</IonSelectOption>
                <IonSelectOption value="ACCEPTED">Accepted</IonSelectOption>
                <IonSelectOption value="REJECTED">Rejected</IonSelectOption>
                <IonSelectOption value="WAITLISTED">Waitlisted</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
        )}

        {applications.length === 0 ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <p>You haven't tracked any applications yet.</p>
              <IonButton
                fill="outline"
                routerLink="/applications/new"
                style={{ marginTop: '12px' }}
              >
                Track an Application
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : filteredApplications.length === 0 ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <p>No applications match your search or filter.</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonList className="application-card-list">
            {filteredApplications.map((app) => (
              <IonCard key={app.id} className="application-card">
                <IonCardHeader className="application-card-header">
                  <div className="application-card-heading">
                    <div>
                      <IonCardTitle className="application-school-name">
                        <IonIcon icon={schoolOutline} color="medium" />
                        {app.school?.name ?? 'Unknown school'}
                      </IonCardTitle>
                      <IonCardSubtitle className="application-program-name">
                        {app.program
                          ? `${app.program.degreeLevel} in ${app.program.name}`
                          : 'Unknown program'}
                      </IonCardSubtitle>
                    </div>
                    {renderDecisionBadge(app.decision)}
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  <div className="application-facts">
                    <div className="application-fact">
                      <span className="application-detail-label">Term</span>
                      <span className="application-detail-value">
                        {app.term
                          ? `${app.term.name} ${app.term.academicYear}`
                          : 'Unknown term'}
                      </span>
                    </div>

                    <div className="application-fact">
                      <span className="application-detail-label">GPA</span>
                      <span className="application-detail-value">
                        {app.gpa === null
                          ? 'Not listed'
                          : Number(app.gpa).toFixed(2)}
                      </span>
                    </div>

                    <div className="application-fact">
                      <span className="application-detail-label">
                        Publications
                      </span>
                      <span className="application-detail-value">
                        {app.publications.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="application-research-area">
                    <span className="application-detail-label">
                      Research area
                    </span>
                    <span className="application-detail-value">
                      {app.researchArea ?? 'Not listed'}
                    </span>
                  </div>

                  <div className="application-awards-row">
                    <span className="application-detail-label">Awards</span>
                    <div className="application-awards-list">
                    {app.awards.length === 0 ? (
                      <span className="application-empty-value">None listed</span>
                    ) : (
                      app.awards.map((award) => (
                        <span
                          key={award}
                          className="application-award-tag"
                        >
                          {award}
                        </span>
                      ))
                    )}
                    </div>
                  </div>

                  <div className="application-comments">
                    <span className="application-detail-label">Comments</span>
                    <p>{app.comments ?? 'No comments added'}</p>
                  </div>

                  {app.decision && (
                    <div
                      className={`application-decision-details application-decision-${app.decision.status.toLowerCase()}`}
                    >
                      <IonIcon icon={ribbonOutline} />
                      <div>
                        <span className="application-detail-value">
                          {app.decision.status === 'ACCEPTED'
                            ? 'Accepted'
                            : app.decision.status === 'REJECTED'
                              ? 'Rejected'
                              : 'Waitlisted'}{' '}
                          on{' '}
                          {new Date(
                            app.decision.decisionDate,
                          ).toLocaleDateString()}
                          {app.decision.status === 'WAITLISTED' &&
                            app.decision.waitlistUntilTerm && (
                              <>
                                {' · Until '}
                                {app.decision.waitlistUntilTerm.name}{' '}
                                {app.decision.waitlistUntilTerm.academicYear}
                              </>
                            )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="application-submission-row">
                    <span>
                      <IonIcon icon={calendarOutline} />
                      Submitted:{' '}
                      {app.submissionDate
                        ? new Date(app.submissionDate).toLocaleDateString()
                        : 'Pending'}
                    </span>
                  </div>

                  <div className="application-actions">
                    <IonButton
                      size="small"
                      fill="clear"
                      color="medium"
                      onClick={() => handleOpenDecisionModal(app.id)}
                    >
                      <IonIcon slot="start" icon={createOutline} />
                      {app.decision ? 'Edit Decision' : 'Update Decision'}
                    </IonButton>

                    <IonButton
                      size="small"
                      fill="clear"
                      color="medium"
                      routerLink={`/applications/${app.id}/edit`}
                    >
                      <IonIcon slot="start" icon={createOutline} />
                      Edit Application
                    </IonButton>

                    <IonButton
                      size="small"
                      fill="clear"
                      color="danger"
                      disabled={deleting}
                      onClick={() => setApplicationToDelete(app)}
                    >
                      <IonIcon slot="start" icon={trashOutline} />
                      Delete
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}
        </div>

        {/* Decision update modal */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <IonContent className="ion-padding">
            <div className="ion-text-center ion-padding-bottom">
              <h3>Record Decision Outcome</h3>
              <p>Specify the admissions outcome for this tracker entry.</p>
            </div>

            {selectedApplication && (
              <DecisionForm
                applicationId={selectedApplication.id}
                applicationTermId={selectedApplication.termId}
                currentStatus={selectedApplication.decision?.status}
                currentDecisionDate={selectedApplication.decision?.decisionDate}
                currentWaitlistUntilTermId={
                  selectedApplication.decision?.waitlistUntilTermId
                }
                onSuccess={handleDecisionSaveSuccess}
              />
            )}

            <div className="ion-padding-horizontal">
              <IonButton
                fill="clear"
                color="medium"
                expand="block"
                onClick={() => setIsModalOpen(false)}
                style={{ marginTop: '12px' }}
              >
                Cancel
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={applicationToDelete !== null}
          header="Delete application?"
          message="This action cannot be undone."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setApplicationToDelete(null),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                void handleDeleteApplication();
              },
            },
          ]}
          onDidDismiss={() => setApplicationToDelete(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ApplicationsPage;
