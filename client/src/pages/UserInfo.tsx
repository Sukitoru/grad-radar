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
  IonPage
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 

function SignUp() {
    const history = useHistory();
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
                <IonInput type = "password" placeholder = "Your overall GPA."/>
            </IonItem>
            
            <IonItem>
                <IonLabel position = "stacked">
                    Awards
                </IonLabel>
                <IonInput type = "password" placeholder = "Any awards you may have."/>
            </IonItem>
            
            <IonItem>
                <IonLabel position = "stacked">
                    Publications
                </IonLabel>
                <IonInput type = "password" placeholder = "Enter the amount of publications you may have."/>
            </IonItem>

            <IonButton expand = "block" className = "ion-margin-top" onClick = { () => history.push('/home')}>
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

export default SignUp;