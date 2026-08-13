import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { analyticsOutline } from 'ionicons/icons';
import HeaderActions from '../components/HeaderActions';
import './AnalyticsDashboard.css';

const AnalyticsDashboard: React.FC = () => {
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
              <IonIcon icon={analyticsOutline} /> Application data
            </span>
            <h1>Community analytics</h1>
            <p>
              Explore trends from graduate application and admission decisions.
            </p>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsDashboard;
