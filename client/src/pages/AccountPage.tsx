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
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonText,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import {
  personCircleOutline,
  schoolOutline,
  calendarOutline,
  ribbonOutline,
  checkmarkCircle,
  closeCircle,
  hourglassOutline,
  createOutline,
  statsChartOutline,
} from 'ionicons/icons';
import {
  getApplications,
  getPrograms,
  getSchools,
  getTerms,
  type Application,
  type Program,
  type School,
  type Term,
} from '../api';
import DecisionForm from '../components/DecisionForm'; // Re-using our previously built form

// Defining Type Interfaces for the Account Page
interface UserProfile {
  id: string;
  username: string;
  gpa?: number;
  researchArea?: string;
  awards?: string;
  publications?: number;
}

const AccountPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal tracking states
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch the lookup lists and applications used by the tracker.
  const fetchAccountData = async () => {
    setLoading(true);
    setError(null);

    try {
      const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

      if (!demoUserId) {
        throw new Error('VITE_DEMO_USER_ID is missing from the client environment.');
      }

      const [applicationData, schoolData, programData, termData] = await Promise.all([
        getApplications(),
        getSchools(),
        getPrograms(),
        getTerms(),
      ]);

      const userApplications = applicationData.filter(
        (application) => application.userId === demoUserId,
      );

      setApplications(userApplications);
      setSchools(schoolData);
      setPrograms(programData);
      setTerms(termData);

      // Mock User Profile
      setProfile({
        id: 'usr-928471',
        username: 'AcademicBound99',
        gpa: 3.89,
        researchArea: 'Distributed Systems & Privacy',
        awards: 'Dean\'s List',
        publications: 2,
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve account records.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAccountData();
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
    fetchAccountData(); // Reload account data to reflect updated decision status
  };

  const getSchoolName = (schoolId: string) => {
    return schools.find((school) => school.id === schoolId)?.name ?? 'Unknown school';
  };

  const getProgramDescription = (programId: string) => {
    const program = programs.find((currentProgram) => currentProgram.id === programId);

    if (!program) {
      return 'Unknown program';
    }

    return `${program.degreeLevel} in ${program.name}`;
  };

  const getTermName = (termId: string) => {
    const term = terms.find((currentTerm) => currentTerm.id === termId);

    if (!term) {
      return 'Unknown term';
    }

    return `${term.name} ${term.academicYear}`;
  };

  // Helper helper to generate decision status badges
  const renderDecisionBadge = (decision: Application['decision']) => {
    if (!decision) {
      return (
        <IonBadge color="medium" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IonIcon icon={hourglassOutline} />
          PENDING
        </IonBadge>
      );
    }

    switch (decision.status) {
      case 'ACCEPTED':
        return (
          <IonBadge color="success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={checkmarkCircle} />
            ACCEPTED
          </IonBadge>
        );
      case 'REJECTED':
        return (
          <IonBadge color="danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={closeCircle} />
            REJECTED
          </IonBadge>
        );
      case 'WAITLISTED':
        return (
          <IonBadge color="warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={hourglassOutline} />
            WAITLISTED
          </IonBadge>
        );
    }
  };

  // Calculate high-level stats for user analytics
  const totalApps = applications.length;
  const acceptedApps = applications.filter(a => a.decision?.status === 'ACCEPTED').length;
  const waitlistedApps = applications.filter(a => a.decision?.status === 'WAITLISTED').length;
  const pendingApps = applications.filter(a => !a.decision).length;
  const selectedApplication = applications.find((application) => application.id === selectedAppId);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <div style={{ marginTop: '40%' }}>
            <IonSpinner name="crescent" />
            <p>Loading your profile...</p>
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
          <IonTitle>My Account & Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {error && (
          <IonCard color="danger">
            <IonCardContent>{error}</IonCardContent>
          </IonCard>
        )}

        {profile && (
          <>
            {/* 1. Pseudonymous Profile Summary Card */}
            <IonCard>
              <IonCardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '48px', color: 'var(--ion-color-primary)' }} />
                  <div>
                    <IonCardTitle>{profile.username}</IonCardTitle>
                    <IonCardSubtitle>Academic Profile (Pseudonymous)</IonCardSubtitle>
                  </div>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="6" sizeMd="3">
                      <IonText color="medium"><h6>GPA</h6></IonText>
                      <h4 style={{ margin: '4px 0 0' }}>{profile.gpa || 'N/A'}</h4>
                    </IonCol>
                    <IonCol size="6" sizeMd="3">
                      <IonText color="medium"><h6>Research Field</h6></IonText>
                      <h4 style={{ margin: '4px 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {profile.researchArea || 'N/A'}
                      </h4>
                    </IonCol>
                    <IonCol size="6" sizeMd="3">
                      <IonText color="medium"><h6>Awards</h6></IonText>
                      <h4 style={{ margin: '4px 0 0' }}>{profile.awards || 'None listed'}</h4>
                    </IonCol>
                    <IonCol size="6" sizeMd="3">
                      <IonText color="medium"><h6>Publications</h6></IonText>
                      <h4 style={{ margin: '4px 0 0' }}>{profile.publications || 0}</h4>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* 2. Success Rate & Statistics Banner */}
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={statsChartOutline} />
                  APPLICATION METRICS
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent style={{ paddingTop: 0 }}>
                <IonGrid>
                  <IonRow className="ion-text-center">
                    <IonCol>
                      <h2 style={{ color: 'var(--ion-color-dark)', fontWeight: 'bold' }}>{totalApps}</h2>
                      <IonText color="medium"><small>Submitted</small></IonText>
                    </IonCol>
                    <IonCol>
                      <h2 style={{ color: 'var(--ion-color-success)', fontWeight: 'bold' }}>{acceptedApps}</h2>
                      <IonText color="success"><small>Accepted</small></IonText>
                    </IonCol>
                    <IonCol>
                      <h2 style={{ color: 'var(--ion-color-warning)', fontWeight: 'bold' }}>{waitlistedApps}</h2>
                      <IonText color="warning"><small>Waitlisted</small></IonText>
                    </IonCol>
                    <IonCol>
                      <h2 style={{ color: 'var(--ion-color-step-600)', fontWeight: 'bold' }}>{pendingApps}</h2>
                      <IonText color="medium"><small>Pending</small></IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* 3. Personal Tracker List Section */}
            <h5 className="ion-padding-start" style={{ fontWeight: 'bold', margin: '24px 0 12px' }}>
              My Tracked Applications
            </h5>

            {applications.length === 0 ? (
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <p>You haven't tracked any applications yet.</p>
                  <IonButton fill="outline" routerLink="/applications/new" style={{ marginTop: '12px' }}>
                    Track an Application
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonList>
                {applications.map((app) => (
                  <IonCard key={app.id} style={{ margin: '0 0 16px 0' }}>
                    <IonItem lines="none" style={{ '--padding-start': '16px' }}>
                      <div style={{ padding: '12px 0', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonIcon icon={schoolOutline} color="secondary" />
                            {getSchoolName(app.schoolId)}
                          </span>
                          {renderDecisionBadge(app.decision)}
                        </div>

                        <p style={{ margin: '8px 0 4px', fontSize: '14px', color: 'var(--ion-color-step-600)' }}>
                          {getProgramDescription(app.programId)} · {getTermName(app.termId)}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--ion-color-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IonIcon icon={calendarOutline} />
                            Submitted: {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Pending'}
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

                        {app.decision && (
                          <div style={{ 
                            marginTop: '12px', 
                            padding: '8px 12px', 
                            backgroundColor: 'var(--ion-color-step-50)', 
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px'
                          }}>
                            <IonIcon icon={ribbonOutline} color="warning" />
                            <strong>Decision Date:</strong> {new Date(app.decision.decisionDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </IonItem>
                  </IonCard>
                ))}
              </IonList>
            )}

            {/* 4. Decision Update Modal containing our DecisionForm component */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
