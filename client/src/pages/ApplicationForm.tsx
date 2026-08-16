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
  getErrorMessage,
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
import './FormPages.css';

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
        setError(getErrorMessage(loadError, 'Failed to load the form options.'));
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
      setError(getErrorMessage(saveError, 'Failed to save the application.'));
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
        <div className="form-page-container">
          <header className="form-page-heading">
            <span className="form-page-label">Application tracker</span>
            <h1>{isEditing ? 'Edit application' : 'Add an application'}</h1>
            <p>Enter the information for your graduate school application.</p>
          </header>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading schools, programs, and terms...</p>
          </div>
        ) : (
          <form className="form-page-form" onSubmit={handleSubmit}>
            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>01</span>
                <div>
                  <h2>School and program</h2>
                  <p>Select where and what you applied to.</p>
                </div>
              </div>
              <IonList className="form-page-fields form-page-fields-two-column">
              <IonItem>
                <IonSelect
                  interface="popover"
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
                  interface="popover"
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
            </section>

            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>02</span>
                <div>
                  <h2>Starting term</h2>
                  <p>Choose the semester and year for this program.</p>
                </div>
              </div>
              <IonList className="form-page-fields form-page-fields-two-column">
              <IonItem>
                <IonSelect
                  interface="popover"
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
                  interface="popover"
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
            </section>

            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>03</span>
                <div>
                  <h2>Academic statistics</h2>
                  <p>Add the GPA included with this application.</p>
                </div>
              </div>
              <IonList className="form-page-fields">
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
            </section>

            <section className="form-page-section">
              <div className="form-page-section-heading">
                <span>04</span>
                <div>
                  <h2>Application details</h2>
                  <p>Add research interests, experience, and private notes.</p>
                </div>
              </div>
              <IonList className="form-page-fields form-page-fields-three-column">
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

              <IonItem className="form-page-field-wide">
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
            </section>

            {message && <IonNote className="form-page-note" color="success">{message}</IonNote>}
            {error && <IonNote className="form-page-note" color="danger">{error}</IonNote>}

            <div className="form-page-actions">
            <IonButton
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
            </div>
          </form>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ApplicationForm;
