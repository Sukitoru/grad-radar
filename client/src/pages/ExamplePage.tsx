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
  IonInput,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  addOutline,
  calendarOutline,
  checkmarkCircleOutline,
  createOutline,
  hourglassOutline,
  schoolOutline,
  statsChartOutline,
  trashOutline,
} from 'ionicons/icons';
import HeaderActions from '../components/HeaderActions';
import './ExamplePage.css';

/*
 * This page is a visual template for future pages.
 * Replace the example values with real data and keep the same section order.
 */
const ExamplePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Example Page</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <main className="example-page-container">
          {/* 1. Page heading and main action */}
          <section className="example-page-overview">
            <div className="example-page-overview-heading">
              <div>
                <span className="example-page-label">Page label</span>
                <h1>Page title</h1>
              </div>

              <IonButton>
                <IonIcon slot="start" icon={addOutline} />
                Add item
              </IonButton>
            </div>

            {/* 2. Summary metrics */}
            <div className="example-page-metrics">
              <div className="example-page-metric">
                <strong>24</strong>
                <span>Total items</span>
              </div>
              <div className="example-page-metric example-page-metric-success">
                <strong>18</strong>
                <span>Complete</span>
              </div>
              <div className="example-page-metric">
                <strong>6</strong>
                <span>Pending</span>
              </div>
            </div>
          </section>

          {/* 3. Form section and fields */}
          <section className="example-page-form-section">
            <div className="example-page-section-heading">
              <span>01</span>
              <div>
                <span className="example-page-section-label">Form section</span>
                <h2>Application details</h2>
              </div>
            </div>

            <IonList className="example-page-form-fields example-page-form-fields-three">
              <IonItem>
                <IonInput label="School" labelPlacement="stacked" value="Example University" />
              </IonItem>
              <IonItem>
                <IonInput label="Program" labelPlacement="stacked" value="Computer Science" />
              </IonItem>
              <IonItem>
                <IonSelect label="Term" labelPlacement="stacked" value="Fall 2026">
                  <IonSelectOption value="Fall 2026">Fall 2026</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonInput label="GPA" labelPlacement="stacked" type="number" value="4.00" />
              </IonItem>
              <IonItem>
                <IonInput label="Publications" labelPlacement="stacked" type="number" value="11" />
              </IonItem>
              <IonItem className="example-page-field-wide">
                <IonTextarea label="Comments" labelPlacement="stacked" value="Example comment" />
              </IonItem>
            </IonList>

            <div className="example-page-actions">
              <IonButton>Save</IonButton>
              <IonButton fill="outline">Cancel</IonButton>
            </div>
          </section>

          {/* 4. Search and filter controls */}
          <section className="example-page-list-section">
            <div className="example-page-list-heading">
              <div>
                <span className="example-page-section-label">
                  <IonIcon icon={statsChartOutline} />
                  Records
                </span>
                <h2>Tracked items</h2>
              </div>
              <span className="example-page-count">24 items</span>
            </div>

            <div className="example-page-filters">
              <IonSearchbar
                className="example-page-search"
                placeholder="Search by name or program"
              />
              <IonItem className="example-page-filter" lines="none">
                <IonSelect label="Status" labelPlacement="stacked" value="ALL">
                  <IonSelectOption value="ALL">All statuses</IonSelectOption>
                  <IonSelectOption value="COMPLETE">Complete</IonSelectOption>
                  <IonSelectOption value="PENDING">Pending</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>

            {/* 5. Repeated result cards */}
            <div className="example-page-card-list">
              <IonCard className="example-page-card">
                <IonCardHeader className="example-page-card-header">
                  <div className="example-page-card-heading">
                    <div>
                      <IonCardTitle className="example-page-card-title">
                        <IonIcon icon={schoolOutline} />
                        Example University
                      </IonCardTitle>
                      <IonCardSubtitle>
                        Masters in Computer Science
                      </IonCardSubtitle>
                    </div>

                    <IonBadge color="success">
                      <IonIcon icon={checkmarkCircleOutline} />
                      Complete
                    </IonBadge>
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  {/* 6. Facts in a consistent three-column row */}
                  <div className="example-page-facts">
                    <div className="example-page-fact">
                      <span>Term</span>
                      <strong>Fall 2026</strong>
                    </div>
                    <div className="example-page-fact">
                      <span>GPA</span>
                      <strong>4.00</strong>
                    </div>
                    <div className="example-page-fact">
                      <span>Publications</span>
                      <strong>11</strong>
                    </div>
                  </div>

                  {/* 7. Supporting details */}
                  <div className="example-page-detail">
                    <span>Research area</span>
                    <strong>Distributed systems</strong>
                  </div>

                  <div className="example-page-detail">
                    <span>Awards</span>
                    <div className="example-page-tags">
                      <span>Dean&apos;s List</span>
                      <span>Research Award</span>
                    </div>
                  </div>

                  {/* 8. Comments */}
                  <div className="example-page-comments">
                    <span>Comments</span>
                    <strong>Example comment</strong>
                  </div>

                  {/* 9. Dates and actions */}
                  <div className="example-page-card-footer">
                    <div className="example-page-dates">
                      <span>
                        <IonIcon icon={calendarOutline} />
                        Decision received: 2/1/2026
                      </span>
                      <span>Added on: 2/5/2026</span>
                    </div>
                    <div className="example-page-actions">
                      <IonButton fill="outline" size="small">
                        <IonIcon slot="start" icon={createOutline} />
                        Edit
                      </IonButton>
                      <IonButton fill="outline" color="danger" size="small">
                        <IonIcon slot="start" icon={trashOutline} />
                        Delete
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="example-page-card">
                <IonCardHeader className="example-page-card-header">
                  <div className="example-page-card-heading">
                    <div>
                      <IonCardTitle className="example-page-card-title">
                        <IonIcon icon={schoolOutline} />
                        Another University
                      </IonCardTitle>
                      <IonCardSubtitle>Doctoral in Biology</IonCardSubtitle>
                    </div>

                    <IonBadge color="warning">
                      <IonIcon icon={hourglassOutline} />
                      Waitlisted
                    </IonBadge>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <div className="example-page-waitlist">
                    <IonIcon icon={hourglassOutline} />
                    Waitlisted until Spring 2027
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* 10. Pagination */}
            <div className="example-page-pagination">
              <IonButton fill="outline" size="small">Previous</IonButton>
              <span>Page 1 of 3</span>
              <IonButton fill="outline" size="small">Next</IonButton>
            </div>
          </section>

          {/* 11. Loading, error, and empty states */}
          <section className="example-page-state-section">
            <div className="example-page-section-heading">
              <span>02</span>
              <div>
                <span className="example-page-section-label">Page states</span>
                <h2>Loading, error, and empty</h2>
              </div>
            </div>

            <div className="example-page-state-grid">
              <div className="example-page-state">
                <IonSpinner name="crescent" />
                <strong>Loading state</strong>
              </div>
              <IonNote className="example-page-state example-page-error-state" color="danger">
                Error state
              </IonNote>
              <div className="example-page-state">
                <strong>Empty state</strong>
              </div>
            </div>
          </section>

          {/* 12. Analytics summary and chart area */}
          <section className="example-page-analytics-section">
            <div className="example-page-section-heading">
              <span>03</span>
              <div>
                <span className="example-page-section-label">Analytics</span>
                <h2>Summary and visualization</h2>
              </div>
            </div>

            <div className="example-page-chart-placeholder">
              <span>Chart area</span>
            </div>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default ExamplePage;
