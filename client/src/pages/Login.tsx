//To login with the same credentials

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
import { useState } from 'react';
import './Login.css';

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');

        if (
            email === savedEmail && password === savedPassword
        ) {
            localStorage.setItem('loggedIn', 'true');
            history.push('/home');
        } else {
            setError('Invalid email or password.')
        }
    };

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
                <IonInput type = "email" value = {email} onIonInput = { (e) => setEmail(String(e.detail.value ?? ''))} placeholder = "example@.edu" required/>
            </IonItem>

            <IonItem>
                <IonLabel position = "stacked">
                    Password
                </IonLabel>
                <IonInput type = "password" value = {password} onIonInput = { (e) => setPassword(String(e.detail.value ?? ''))} placeholder = "Enter your password." required/>
            </IonItem>

            {error && (
                <p className = "error-message">
                    {error}
                </p>
            )}

            <IonButton expand = "block" className = "ion-margin-top" onClick = {handleLogin}>
                Login
            </IonButton>

            </IonCardContent>
        </IonCard>
    </IonContent>
</IonPage>

  );
}

export default Login;