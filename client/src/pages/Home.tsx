import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import HeaderActions from '../components/HeaderActions';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  peopleOutline,
  schoolOutline,
} from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>
          <IonTitle>Grad Radar</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <main className="home-page">
          <section className="home-intro">
            <IonIcon icon={schoolOutline} aria-hidden="true" />
            <h1>Grad Radar</h1>
            <p>
              Track your graduate school applications and learn from admission
              decisions shared by other applicants.
            </p>

            <div className="home-buttons">
              <IonButton routerLink="/applications/new">
                Add an application
              </IonButton>
              <IonButton fill="outline" routerLink="/account">
                My applications
              </IonButton>
            </div>
          </section>

          <section className="home-steps" aria-labelledby="steps-title">
            <h2 id="steps-title">How it works</h2>

            <div className="home-step-list">
              <div className="home-step">
                <IonIcon icon={addCircleOutline} aria-hidden="true" />
                <h3>Add an application</h3>
                <p>Save the school, program, GPA, and application details.</p>
              </div>

              <div className="home-step">
                <IonIcon icon={checkmarkCircleOutline} aria-hidden="true" />
                <h3>Update your decision</h3>
                <p>Record whether you were accepted, rejected, or waitlisted.</p>
              </div>

              <div className="home-step">
                <IonIcon icon={peopleOutline} aria-hidden="true" />
                <h3>Learn from others</h3>
                <p>View results shared by the community.</p>
              </div>
            </div>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Home;
