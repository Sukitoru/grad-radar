import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonText,
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
} from 'ionicons/icons';
import { deleteApplication, getApplications, type Application } from '../api';
import DecisionForm from '../components/DecisionForm'; // Re-using our previously built form

const getValidPublicationLinks = (publicationLinks: string | null) =>
  publicationLinks
    ?.split('\n')
    .map((link) => link.trim())
    .filter((link) => link.startsWith('https://') || link.startsWith('http://')) ?? [];

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
          color="medium"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <IonIcon icon={hourglassOutline} />
          PENDING
        </IonBadge>
      );
    }

    switch (decision.status) {
      case 'ACCEPTED':
        return (
          <IonBadge
            color="success"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={checkmarkCircle} />
            ACCEPTED
          </IonBadge>
        );
      case 'REJECTED':
        return (
          <IonBadge
            color="danger"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={closeCircle} />
            REJECTED
          </IonBadge>
        );
      case 'WAITLISTED':
        return (
          <IonBadge
            color="warning"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <IonIcon icon={hourglassOutline} />
            WAITLISTED
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
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>My Applications</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {error && (
          <IonCard color="danger">
            <IonCardContent>{error}</IonCardContent>
          </IonCard>
        )}

        {/* Application statistics */}
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IonIcon icon={statsChartOutline} />
              APPLICATION METRICS
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingTop: 0 }}>
            <IonGrid>
              <IonRow className="ion-text-center">
                <IonCol>
                  <h2
                    style={{
                      color: 'var(--ion-color-dark)',
                      fontWeight: 'bold',
                    }}
                  >
                    {totalApps}
                  </h2>
                  <IonText color="medium">
                    <small>Submitted</small>
                  </IonText>
                </IonCol>
                <IonCol>
                  <h2
                    style={{
                      color: 'var(--ion-color-success)',
                      fontWeight: 'bold',
                    }}
                  >
                    {acceptedApps}
                  </h2>
                  <IonText color="success">
                    <small>Accepted</small>
                  </IonText>
                </IonCol>
                <IonCol>
                  <h2
                    style={{
                      color: 'var(--ion-color-warning)',
                      fontWeight: 'bold',
                    }}
                  >
                    {waitlistedApps}
                  </h2>
                  <IonText color="warning">
                    <small>Waitlisted</small>
                  </IonText>
                </IonCol>
                <IonCol>
                  <h2
                    style={{
                      color: 'var(--ion-color-step-600)',
                      fontWeight: 'bold',
                    }}
                  >
                    {pendingApps}
                  </h2>
                  <IonText color="medium">
                    <small>Pending</small>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Personal tracker list */}
        <h5
          className="ion-padding-start"
          style={{ fontWeight: 'bold', margin: '24px 0 12px' }}
        >
          My Tracked Applications
        </h5>

        {applications.length > 0 && (
          <>
            <IonSearchbar
              value={searchText}
              placeholder="Search by school or program"
              onIonInput={(event) =>
                setSearchText(String(event.detail.value ?? ''))
              }
            />

            <IonItem>
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
          </>
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
          <IonList>
            {filteredApplications.map((app) => (
              <IonCard key={app.id} style={{ margin: '0 0 16px 0' }}>
                <IonItem lines="none" style={{ '--padding-start': '16px' }}>
                  <div style={{ padding: '12px 0', width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <IonIcon icon={schoolOutline} color="secondary" />
                        {app.school?.name ?? 'Unknown school'}
                      </span>
                      {renderDecisionBadge(app.decision)}
                    </div>

                    <p
                      style={{
                        margin: '8px 0 4px',
                        fontSize: '14px',
                        color: 'var(--ion-color-step-600)',
                      }}
                    >
                      {app.program
                        ? `${app.program.degreeLevel} in ${app.program.name}`
                        : 'Unknown program'}
                      {' · '}
                      {app.term
                        ? `${app.term.name} ${app.term.academicYear}`
                        : 'Unknown term'}
                    </p>

                    <p>
                      <strong>GPA:</strong> {app.gpa ?? 'Not listed'}
                    </p>
                    <p>
                      <strong>Research area:</strong>{' '}
                      {app.researchArea ?? 'Not listed'}
                    </p>
                    <p>
                      <strong>Awards:</strong> {app.awards ?? 'None listed'}
                    </p>
                    <p>
                      <strong>Publications:</strong> {app.publications}
                    </p>

                    {getValidPublicationLinks(app.publicationLinks).length > 0 && (
                      <div>
                        <strong>Publication links:</strong>
                        <ul>
                          {getValidPublicationLinks(app.publicationLinks).map(
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
                      {app.comments ?? 'No comments added'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--ion-color-medium)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <IonIcon icon={calendarOutline} />
                        Submitted:{' '}
                        {app.submissionDate
                          ? new Date(app.submissionDate).toLocaleDateString()
                          : 'Pending'}
                      </span>

                      <IonButton
                        size="small"
                        fill="clear"
                        color="primary"
                        onClick={() => handleOpenDecisionModal(app.id)}
                        style={{ margin: 0 }}
                      >
                        <IonIcon slot="start" icon={createOutline} />
                        {app.decision ? 'Edit Decision' : 'Update Decision'}
                      </IonButton>
                    </div>

                    <div
                      style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
                    >
                      <IonButton
                        size="small"
                        fill="outline"
                        routerLink={`/applications/${app.id}/edit`}
                      >
                        <IonIcon slot="start" icon={createOutline} />
                        Edit Application
                      </IonButton>

                      <IonButton
                        size="small"
                        fill="outline"
                        color="danger"
                        disabled={deleting}
                        onClick={() => setApplicationToDelete(app)}
                      >
                        <IonIcon slot="start" icon={trashOutline} />
                        Delete
                      </IonButton>
                    </div>

                    {app.decision && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          backgroundColor: 'var(--ion-color-step-50)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                        }}
                      >
                        <IonIcon icon={ribbonOutline} color="warning" />
                        <strong>Decision Date:</strong>{' '}
                        {new Date(
                          app.decision.decisionDate,
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </IonItem>
              </IonCard>
            ))}
          </IonList>
        )}

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
                currentStatus={selectedApplication.decision?.status}
                currentDecisionDate={selectedApplication.decision?.decisionDate}
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
