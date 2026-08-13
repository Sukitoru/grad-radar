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
  getUserProfile,
  updateApplication,
  type Program,
  type School,
  type Term,
} from '../api';
import { awardOptions, maximumAwards } from '../awardOptions';
import HeaderActions from '../components/HeaderActions';

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
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState<number | ''>('');
  const [gpa, setGpa] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [awards, setAwards] = useState<string[]>([]);
  const [publications, setPublications] = useState('0');
  const [comments, setComments] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const availablePrograms = programs.filter(
    (program) => program.schoolId === schoolId,
  );
  const availableYears = [...new Set(terms.map((term) => term.academicYear))]
    .sort((firstYear, secondYear) => firstYear - secondYear);

  const selectTerm = (newSemester: string, newYear: number | '') => {
    setSemester(newSemester);
    setAcademicYear(newYear);

    const matchingTerm = terms.find(
      (term) =>
        term.name === newSemester && term.academicYear === newYear,
    );

    setTermId(matchingTerm?.id ?? '');
  };

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
          setSemester(application.term?.name ?? '');
          setAcademicYear(application.term?.academicYear ?? '');
          setGpa(application.gpa === null ? '' : String(application.gpa));
          setResearchArea(application.researchArea ?? '');
          setAwards(application.awards);
          setPublications(String(application.publications));
          setComments(application.comments ?? '');
          setSubmissionDate(application.submissionDate?.slice(0, 10) ?? '');
        } else {
          const demoUserId = import.meta.env.VITE_DEMO_USER_ID;

          if (demoUserId) {
            const profile = await getUserProfile(demoUserId);
            setGpa(profile.defaultGpa === null ? '' : String(profile.defaultGpa));
            setAwards(profile.defaultAwards);
            setPublications(String(profile.defaultPublications));
          }
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
        awards,
        publications: publications ? Number(publications) : 0,
        comments: comments || null,
        submissionDate: submissionDate || null,
      };

      if (applicationId) {
        await updateApplication(applicationId, applicationData);
      } else {
        await createApplication(applicationData);

        const profile = await getUserProfile(demoUserId);
        setSchoolId('');
        setProgramId('');
        setTermId('');
        setSemester('');
        setAcademicYear('');
        setGpa(profile.defaultGpa === null ? '' : String(profile.defaultGpa));
        setResearchArea('');
        setAwards(profile.defaultAwards);
        setPublications(String(profile.defaultPublications));
        setComments('');
        setSubmissionDate('');
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
          <HeaderActions />
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
                  label="Starting Semester"
                  labelPlacement="stacked"
                  placeholder="Select a semester"
                  value={semester}
                  onIonChange={(event) =>
                    selectTerm(event.detail.value, academicYear)
                  }
                  required
                >
                  <IonSelectOption value="Spring">Spring</IonSelectOption>
                  <IonSelectOption value="Fall">Fall</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonSelect
                  label="Starting Year"
                  labelPlacement="stacked"
                  placeholder="Select a year"
                  value={academicYear}
                  onIonChange={(event) =>
                    selectTerm(semester, Number(event.detail.value))
                  }
                  required
                >
                  {availableYears.map((year) => (
                    <IonSelectOption key={year} value={year}>
                      {year}
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
                <IonInput
                  label="Research Area"
                  labelPlacement="stacked"
                  placeholder="For example, distributed systems"
                  maxlength={255}
                  value={researchArea}
                  onIonInput={(event) =>
                    setResearchArea(String(event.detail.value ?? ''))
                  }
                />
              </IonItem>

              <IonItem>
                <IonSelect
                  label="Awards"
                  labelPlacement="stacked"
                  placeholder="Select up to 5 awards"
                  multiple={true}
                  value={awards}
                  onIonChange={(event) => {
                    const selectedAwards = event.detail.value as string[];

                    if (selectedAwards.length <= maximumAwards) {
                      setAwards(selectedAwards);
                      setError('');
                    } else {
                      setError(`Select no more than ${maximumAwards} awards.`);
                    }
                  }}
                >
                  {awardOptions.map((award) => (
                    <IonSelectOption key={award} value={award}>
                      {award}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonInput
                  type="number"
                  min="0"
                  max="100"
                  step="1"
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
                <IonTextarea
                  label="Application Comments"
                  labelPlacement="stacked"
                  placeholder="Share any notes about your application"
                  autoGrow={true}
                  value={comments}
                  onIonInput={(event) =>
                    setComments(String(event.detail.value ?? ''))
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
