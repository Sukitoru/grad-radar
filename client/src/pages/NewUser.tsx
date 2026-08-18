//The main login and sign up page when starting the website 

import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle,
  IonContent,
  IonPage,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import './NewUser.css';
import { schoolOutline } from 'ionicons/icons';

function NewUser() {
  const history = useHistory();
  return (
    <IonPage>
        <IonContent fullscreen className = "new-user-content">
          <div className = "new-user-container">
          <IonCard className = "new-user-card">
            <IonCardHeader>
              <IonIcon icon = {schoolOutline} className = "school-icon"/>
              <IonCardTitle> Grad Radar </IonCardTitle>
              <IonCardSubtitle> Sign In or Login </IonCardSubtitle>
              </IonCardHeader>
              
              <IonCardContent> Welcome to Grad Radar! </IonCardContent>
              
              <IonButton expand = "block" fill = "clear" onClick = { () => history.push('/signup')}> New here? Sign up! </IonButton>
              <IonButton expand = "block" fill="clear" onClick = {() => history.push('/login')}> Already have an account? Login! </IonButton>
              </IonCard>
            </div>
          </IonContent>
        </IonPage>
  );
}
export default NewUser;