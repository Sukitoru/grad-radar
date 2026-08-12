import { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import {
  createApplication,
  getApplications,
  getPrograms,
  getSchools,
  getTerms,
  updateApplication,
  type Program,
  type School,
  type Term,
} from '../api';

const ApplicationForm: React.FC = () => {
  const history = useHistory();
  const { applicationId } = useParams<{ applicationId?: string }>();
  const isEditing = Boolean(applicationId);
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [schoolId, setSchoolId] = useState('');
  const [programId, setProgramId] = useState('');
  const [termId, setTermId] = useState('');
  const [gpa, setGpa] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [awards, setAwards] = useState('');
  const [publications, setPublications] = useState('0');
  const [submissionDate, setSubmissionDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const availablePrograms = programs.filter(
    (program) => program.schoolId === schoolId,
  );

  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const [schoolOptions, programOptions, termOptions] = await Promise.all([
          getSchools(),
          getPrograms(),
          getTerms(),
        ]);

        setSchools(schoolOptions);
        setPrograms(programOptions);
        setTerms(termOptions);

        if (applicationId) {
          const applications = await getApplications();
          const application = applications.find(
            (currentApplication) => currentApplication.id === applicationId,
          );

          if (!application) {
            throw new Error('Application not found.');
          }

          setSchoolId(application.schoolId);
          setProgramId(application.programId);
          setTermId(application.termId);
          setGpa(application.gpa === null ? '' : String(application.gpa));
          setResearchArea(application.researchArea ?? '');
          setAwards(application.awards ?? '');
          setPublications(String(application.publications));
          setSubmissionDate(application.submissionDate?.slice(0, 10) ?? '');
        }
      } catch (loadError) {
        const loadMessage =
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load the form options.';
        setError(loadMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadFormOptions();
  }, [applicationId]);

  const handleSchoolChange = (newSchoolId: string) => {
    setSchoolId(newSchoolId);
    setProgramId('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

    if (!demoUserId) {
      setError('VITE_DEMO_USER_ID is required for the local demo.');
      return;
    }

    setSaving(true);

    try {
      const applicationData = {
        userId: demoUserId,
        schoolId,
        programId,
        termId,
        gpa: gpa ? Number(gpa) : null,
        researchArea: researchArea || null,
        awards: awards || null,
        publications: publications ? Number(publications) : 0,
        submissionDate: submissionDate || null,
      };

      if (applicationId) {
        await updateApplication(applicationId, applicationData);
      } else {
        await createApplication(applicationData);
      }

      history.push('/applications');
    } catch (saveError) {
      const saveMessage =
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save the application.';
      setError(saveMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Edit Application' : 'Add Application'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>{isEditing ? 'Edit Application Details' : 'Application Details'}</h1>
        <p>Enter the information for your graduate school application.</p>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading schools, programs, and terms...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>School and Program</h2>
            <IonList>
              <IonItem>
                <IonSelect
                  label="School"
                  labelPlacement="stacked"
                  placeholder="Select a school"
                  value={schoolId}
                  onIonChange={(event) => handleSchoolChange(event.detail.value)}
                  required
                >
                  {schools.map((school) => (
                    <IonSelectOption key={school.id} value={school.id}>
                      {school.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonSelect
                  label="Program"
                  labelPlacement="stacked"
                  placeholder="Select a program"
                  value={programId}
                  disabled={!schoolId}
                  onIonChange={(event) => setProgramId(event.detail.value)}
                  required
                >
                  {availablePrograms.map((program) => (
                    <IonSelectOption key={program.id} value={program.id}>
                      {program.degreeLevel} in {program.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>

            <h2>Term</h2>
            <IonList>
              <IonItem>
                <IonSelect
                  label="Starting Term"
                  labelPlacement="stacked"
                  placeholder="Select a term"
                  value={termId}
                  onIonChange={(event) => setTermId(event.detail.value)}
                  required
                >
                  {terms.map((term) => (
                    <IonSelectOption key={term.id} value={term.id}>
                      {term.name} {term.academicYear}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>

            <h2>Academic Statistics</h2>
            <IonList>
              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  label="GPA"
                  labelPlacement="stacked"
                  placeholder="3.75"
                  value={gpa}
                  onIonInput={(event) => setGpa(String(event.detail.value ?? ''))}
                />
              </IonItem>
            </IonList>

            <h2>Application Details</h2>
            <IonList>
              <IonItem>
                <IonTextarea
                  label="Research Area"
                  labelPlacement="stacked"
                  placeholder="Describe your research interests"
                  autoGrow={true}
                  value={researchArea}
                  onIonInput={(event) =>
                    setResearchArea(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonTextarea
                  label="Awards"
                  labelPlacement="stacked"
                  placeholder="List any awards or honors"
                  autoGrow={true}
                  value={awards}
                  onIonInput={(event) => setAwards(String(event.detail.value ?? ''))}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  label="Number of Publications"
                  labelPlacement="stacked"
                  placeholder="0"
                  value={publications}
                  onIonInput={(event) =>
                    setPublications(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type="date"
                  label="Submission Date"
                  labelPlacement="stacked"
                  value={submissionDate}
                  onIonInput={(event) =>
                    setSubmissionDate(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>
            </IonList>

            {message && <IonNote color="success">{message}</IonNote>}
            {error && <IonNote color="danger">{error}</IonNote>}

            <IonButton
              className="ion-margin-top"
              expand="block"
              type="submit"
              disabled={saving || !schoolId || !programId || !termId}
            >
              {saving ? (
                <IonSpinner name="crescent" />
              ) : isEditing ? (
                'Update Application'
              ) : (
                'Save Application'
              )}
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ApplicationForm;
