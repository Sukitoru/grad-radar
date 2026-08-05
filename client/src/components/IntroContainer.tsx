import './IntroContainer.css';
import { IonButton } from '@ionic/react';

const IntroContainer: React.FC = () => {
  return (
    <div id="container">
      <strong>Submit your Grad School Application!</strong>
      <p>Share your admission results with people to help your fellow applicants</p>
      <IonButton id='button'>Submit your Application</IonButton>
      <strong>Or take a look at the luck of your peers!</strong>
      <IonButton id='button'>Search</IonButton>
    </div>

  );
};

export default IntroContainer;
