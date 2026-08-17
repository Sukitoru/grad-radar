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
        <IonCardSubtitle> Login </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>

            <IonItem>
                <IonLabel position = "stacked"> 
                    Email
                </IonLabel>
                <IonInput type = "email" placeholder = "example@icloud.com." required/>
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked">
                    Password
                </IonLabel>
                <IonInput type = "password" placeholder = "Create a password." required/>
            </IonItem>

            <IonButton expand = "block" className = "ion-margin-top" onClick = { () => history.push('/home')}>
                Login
            </IonButton>

            </IonCardContent>
        </IonCard>
    </IonContent>
</IonPage>

  );
}

export default SignUp;