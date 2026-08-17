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
        <IonCardSubtitle> Create Your Account </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>

        <IonItem>
            <IonLabel position = "stacked">
                Full Name 
            </IonLabel>
            <IonInput placeholder = "Enter your name." />
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked"> 
                    Email
                </IonLabel>
                <IonInput type = "email" placeholder = "Enter your email."/>
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked">
                    Password
                </IonLabel>
                <IonInput type = "password" placeholder = "Create a password."/>
            </IonItem>

            <IonButton expand = "block" className = "ion-margin-top" onClick = { () => history.push('/grad-credentials')}>
                Next page 
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