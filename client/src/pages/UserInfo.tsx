//To input your school information like GPA, Awards etc.

import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle ,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  IonPage,
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { useState } from 'react';

function UserInfo() {
    const history = useHistory();
    const [gpa, setGpa] = useState('');
    const [publications, setPublications] = useState('');
    const [awards, setAwards] = useState('');
    const handleSave = () => {
        localStorage.setItem('gpa', gpa);
        localStorage.setItem('publications', publications);
        localStorage.setItem('awards', JSON.stringify(awards));
        localStorage.setItem('loggedIn', 'true');

        history.push('/home');
    }
  return (
    <IonPage>
        <IonContent className = "ion-padding">
    <IonCard>
      <IonCardHeader>
        <IonCardTitle> Grad Radar </IonCardTitle>
        <IonCardSubtitle> Enter your info, you can change this at any time! </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>

        <IonItem>
            <IonLabel position = "stacked">
                ID
            </IonLabel>
            <IonInput placeholder = "Your school ID." />
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked">
                    GPA
                </IonLabel>
                <IonInput value = {gpa} onIonInput = {(e) => setGpa(String(e.detail.value ?? ''))} placeholder = "Your overall GPA."/>
            </IonItem>
            
            <IonItem>
                <IonLabel position = "stacked">
                    Awards
                </IonLabel>
                <IonInput value = {awards} onIonInput = {(e) => setAwards(String(e.detail.value ?? ''))}placeholder = "Any awards you may have."/>
            </IonItem>
            
            <IonItem>
                <IonLabel position = "stacked">
                    Publications
                </IonLabel>
                <IonInput value = {publications} onIonInput = {(e) => setPublications(String(e.detail.value ?? ''))} placeholder = "Enter the amount of publications you may have."/>
            </IonItem>

            <IonButton expand = "block" className = "ion-margin-top" onClick = {handleSave}>
                Sign Up
            </IonButton>

            <IonButton expand = "block" fill = "clear" onClick = { () => history.push('/login')}>
                Already have an account? Login
            </IonButton>
            </IonCardContent>
        </IonCard>
    </IonContent>
</IonPage>

  );
}

export default UserInfo;