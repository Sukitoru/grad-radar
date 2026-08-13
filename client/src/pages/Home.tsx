import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import IntroContainer from '../components/IntroContainer';
import HeaderActions from '../components/HeaderActions';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="toolbar">
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>

          <IonTitle>GradRadar</IonTitle>
          <HeaderActions />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IntroContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
