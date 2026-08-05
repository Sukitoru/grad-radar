import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import IntroContainer from '../components/IntroContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="toolbar">
          <IonTitle>GradRadar</IonTitle>
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
