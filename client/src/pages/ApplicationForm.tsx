import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const ApplicationForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="main-navigation" />
          </IonButtons>

          <IonTitle>Add Application</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Application Details</h1>
        <p>Enter the information for your graduate school application</p>

        <form onSubmit={handleSubmit}>
          <h2>School and Program</h2>

          <IonList>
            <IonItem>
              <IonInput
                label="School"
                labelPlacement="stacked"
                name="school"
                placeholder="Enter the school name"
                required
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Program"
                labelPlacement="stacked"
                name="program"
                placeholder="Enter the program name"
                required
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Degree Level"
                labelPlacement="stacked"
                name="degreeLevel"
                placeholder="Select a degree level"
                required
              >
                <IonSelectOption value="Bachelors">
                  Bachelor&apos;s
                </IonSelectOption>
                <IonSelectOption value="Masters">Master&apos;s</IonSelectOption>
                <IonSelectOption value="Doctoral">Doctoral</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
          <h2>Term</h2>
          <IonList>
            <IonItem>
              <IonSelect
                label="Starting Term"
                labelPlacement="stacked"
                name="term"
                placeholder="Select a term"
                required
              >
                <IonSelectOption value="Fall">Fall</IonSelectOption>
                <IonSelectOption value="Spring">Spring</IonSelectOption>
                <IonSelectOption value="Summer">Summer</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                type="number"
                label="Academic Year"
                labelPlacement="stacked"
                name="academicYear"
                placeholder="For example, 2027"
                required
              />
            </IonItem>
          </IonList>
          <h2>Academic Statistics</h2>

          <IonList>
            <IonItem>
              <IonInput
                type="number"
                step="0.01"
                label="GPA"
                labelPlacement="stacked"
                name="gpa"
                placeholder="3.75"
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="number"
                label="GRE Verbal"
                labelPlacement="stacked"
                name="greVerbal"
                placeholder="Enter your verbal score"
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="number"
                label="GRE Quantitative"
                labelPlacement="stacked"
                name="greQuantitative"
                placeholder="Enter your quantitative score"
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="number"
                step="0.5"
                label="GRE Writing"
                labelPlacement="stacked"
                name="greWriting"
                placeholder="Enter your writing score"
              />
            </IonItem>
          </IonList>
          <h2>Application Details</h2>

          <IonList>
            <IonItem>
              <IonTextarea
                label="Research Area"
                labelPlacement="stacked"
                name="researchArea"
                placeholder="Describe your research interests"
                autoGrow={true}
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="number"
                label="Number of Publications"
                labelPlacement="stacked"
                name="publications"
                placeholder="0"
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="date"
                label="Submission Date"
                labelPlacement="stacked"
                name="submissionDate"
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" type="submit">
            Save Application
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ApplicationForm;
