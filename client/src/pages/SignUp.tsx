//To create a new user only with a .edu email

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
import './SignUp.css';


function SignUp() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountCreated, setAccountCreated] = useState(false);
    const [error, setError] = useState('');
    const createAccount = () => {
        if (!email || !password) {
            setError('Email and Password are required.');
            return;
        }

        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        if (!email.endsWith('.edu')) {
            setError('Please enter a valid school email address.')
            return;
        }

        setError('');
        setAccountCreated(true);

        history.push('/grad-credentials');
    }; 

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
                First Name 
            </IonLabel>
            <IonInput placeholder = "Enter your First name." />
            </IonItem>
            
            <IonItem>
            <IonLabel position = "stacked">
                Last Name 
            </IonLabel>
            <IonInput placeholder = "Enter your Last name." />

            </IonItem>

            <IonItem>
                <IonLabel position = "stacked"> 
                    Email
                </IonLabel>
                <IonInput value = {email} onIonInput = {(e) => setEmail(e.detail.value ?? '')} type = "email" placeholder = "Enter your email."/>
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked">
                    Password
                </IonLabel>
                <IonInput value = {password} onIonInput = {(e) => setPassword(e.detail.value ?? '')} type = "password" placeholder = "Create a password."/>
            </IonItem>

            {error && (
                <p className = "error-message">
                {error}
                </p>
            )}

            <IonButton expand = "block" onClick = {createAccount}>
                Create Account
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