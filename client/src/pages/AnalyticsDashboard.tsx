import { useState } from 'react';
import {
  IonButton,
  IonButtons,
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
  analyticsOutline,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import HeaderActions from '../components/HeaderActions';
import {
  useAnalyticsApplications,
  useAnalyticsPrograms,
  useAnalyticsSchools,
  useAnalyticsTerms,
  type AnalyticsFilters,
} from '../analyticsData';
import './AnalyticsDashboard.css';

const AnalyticsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [gpaRange, setGpaRange] = useState('ALL');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const allApplicationsQuery = useAnalyticsApplications();
  const filteredApplicationsQuery = useAnalyticsApplications(filters);
  const schoolsQuery = useAnalyticsSchools();
  const programsQuery = useAnalyticsPrograms();
  const termsQuery = useAnalyticsTerms();

  const allApplications = allApplicationsQuery.data ?? [];
  const filteredApplications = filteredApplicationsQuery.data ?? [];
  const schools = schoolsQuery.data ?? [];
  const programs = programsQuery.data ?? [];
  const terms = termsQuery.data ?? [];

  const availableProgramNames = Array.from(
    new Set(
      programs
        .filter(
          (program) =>
            !filters.schoolId || program.schoolId === filters.schoolId,
        )
        .map((program) => program.name),
    ),
  ).sort();
  const researchAreas = Array.from(
    new Set(
      allApplications.flatMap((application) =>
        application.researchArea ? [application.researchArea] : [],
      ),
    ),
  ).sort();

  const isLoading =
    allApplicationsQuery.isPending ||
    filteredApplicationsQuery.isPending ||
    schoolsQuery.isPending ||
    programsQuery.isPending ||
    termsQuery.isPending;
  const hasError =
    allApplicationsQuery.isError ||
    filteredApplicationsQuery.isError ||
    schoolsQuery.isError ||
    programsQuery.isError ||
    termsQuery.isError;

  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...newFilters,
    }));
  };

  const updateGpaRange = (newRange: string) => {
    setGpaRange(newRange);

    if (newRange === '3.75-4.00') {
      updateFilters({ minimumGpa: 3.75, maximumGpa: 4 });
    } else if (newRange === '3.50-3.74') {
      updateFilters({ minimumGpa: 3.5, maximumGpa: 3.74 });
    } else if (newRange === '3.00-3.49') {
      updateFilters({ minimumGpa: 3, maximumGpa: 3.49 });
    } else if (newRange === 'BELOW-3.00') {
      updateFilters({ minimumGpa: 0, maximumGpa: 2.99 });
    } else {
      updateFilters({ minimumGpa: undefined, maximumGpa: undefined });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setGpaRange('ALL');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Analytics</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <main className="analytics-page-container">
          <section className="analytics-overview">
            <span className="analytics-overview-label">
              <IonIcon icon={analyticsOutline} /> Data explorer
            </span>
            <h1>Explore application results</h1>
            <p>
              Filter application data by school, program, GPA, research area,
              term, and admission decision.
            </p>
          </section>

          <section className="analytics-filter-panel">
            <div className="analytics-filter-heading">
              <div>
                <h2>Filter application data</h2>
                <p>Combine filters to narrow the application records.</p>
              </div>
              <div className="analytics-filter-heading-actions">
                {filtersExpanded && (
                  <IonButton fill="clear" size="small" onClick={clearFilters}>
                    Clear filters
                  </IonButton>
                )}
                <IonButton
                  fill="outline"
                  size="small"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                >
                  <IonIcon
                    slot="start"
                    icon={
                      filtersExpanded ? chevronUpOutline : chevronDownOutline
                    }
                  />
                  {filtersExpanded ? 'Hide filters' : 'Show filters'}
                </IonButton>
              </div>
            </div>

            <div className="analytics-filter-controls" hidden={!filtersExpanded}>
              <IonSearchbar
                className="analytics-search"
                value={filters.searchText ?? ''}
                placeholder="Search schools, programs, or research areas"
                debounce={250}
                onIonInput={(event) =>
                  updateFilters({
                    searchText: String(event.detail.value ?? ''),
                  })
                }
              />

              <div className="analytics-filter-grid">
              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="School"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.schoolId ?? 'ALL'}
                  onIonChange={(event) => {
                    const schoolId = String(event.detail.value);
                    updateFilters({
                      schoolId: schoolId === 'ALL' ? undefined : schoolId,
                      programId: undefined,
                      programName: undefined,
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All schools</IonSelectOption>
                  {schools.map((school) => (
                    <IonSelectOption key={school.id} value={school.id}>
                      {school.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="Program"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.programName ?? 'ALL'}
                  onIonChange={(event) => {
                    const programName = String(event.detail.value);
                    updateFilters({
                      programName:
                        programName === 'ALL' ? undefined : programName,
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All programs</IonSelectOption>
                  {availableProgramNames.map((programName) => (
                    <IonSelectOption key={programName} value={programName}>
                      {programName}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="Research area"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.researchArea ?? 'ALL'}
                  onIonChange={(event) => {
                    const researchArea = String(event.detail.value);
                    updateFilters({
                      researchArea:
                        researchArea === 'ALL' ? undefined : researchArea,
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All research areas</IonSelectOption>
                  {researchAreas.map((researchArea) => (
                    <IonSelectOption key={researchArea} value={researchArea}>
                      {researchArea}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="Degree"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.degreeLevel ?? 'ALL'}
                  onIonChange={(event) => {
                    const degreeLevel = String(event.detail.value);
                    updateFilters({
                      degreeLevel:
                        degreeLevel === 'ALL'
                          ? undefined
                          : (degreeLevel as 'Masters' | 'Doctoral'),
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All degrees</IonSelectOption>
                  <IonSelectOption value="Masters">Masters</IonSelectOption>
                  <IonSelectOption value="Doctoral">Doctoral</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="Application term"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.termId ?? 'ALL'}
                  onIonChange={(event) => {
                    const termId = String(event.detail.value);
                    updateFilters({
                      termId: termId === 'ALL' ? undefined : termId,
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All terms</IonSelectOption>
                  {terms.map((term) => (
                    <IonSelectOption key={term.id} value={term.id}>
                      {term.name} {term.academicYear}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="Decision"
                  labelPlacement="stacked"
                  interface="popover"
                  value={filters.decisionStatus ?? 'ALL'}
                  onIonChange={(event) => {
                    const decisionStatus = String(event.detail.value);
                    updateFilters({
                      decisionStatus:
                        decisionStatus === 'ALL'
                          ? undefined
                          : (decisionStatus as AnalyticsFilters['decisionStatus']),
                    });
                  }}
                >
                  <IonSelectOption value="ALL">All decisions</IonSelectOption>
                  <IonSelectOption value="PENDING">Pending</IonSelectOption>
                  <IonSelectOption value="ACCEPTED">Accepted</IonSelectOption>
                  <IonSelectOption value="REJECTED">Rejected</IonSelectOption>
                  <IonSelectOption value="WAITLISTED">Waitlisted</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="analytics-filter-item" lines="none">
                <IonSelect
                  label="GPA range"
                  labelPlacement="stacked"
                  interface="popover"
                  value={gpaRange}
                  onIonChange={(event) =>
                    updateGpaRange(String(event.detail.value))
                  }
                >
                  <IonSelectOption value="ALL">All GPAs</IonSelectOption>
                  <IonSelectOption value="3.75-4.00">3.75–4.00</IonSelectOption>
                  <IonSelectOption value="3.50-3.74">3.50–3.74</IonSelectOption>
                  <IonSelectOption value="3.00-3.49">3.00–3.49</IonSelectOption>
                  <IonSelectOption value="BELOW-3.00">Below 3.00</IonSelectOption>
                </IonSelect>
              </IonItem>
              </div>

            </div>
          </section>

          <section className="analytics-query-result" aria-live="polite">
            {isLoading ? (
              <>
                <IonSpinner name="crescent" />
                <span>Loading application data...</span>
              </>
            ) : hasError ? (
              <span>Unable to load the application filters.</span>
            ) : (
              <>
                <strong>{filteredApplications.length}</strong>
                <span>
                  {filteredApplications.length === 1
                    ? 'application matches these filters'
                    : 'applications match these filters'}
                </span>
              </>
            )}
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsDashboard;
