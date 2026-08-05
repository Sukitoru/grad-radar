import React, { useState, useEffect } from 'react';
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonSpinner, 
  IonText, 
  IonButton,
  IonIcon
} from '@ionic/react';
import { alertCircleOutline, refreshOutline } from 'ionicons/icons';
import { fetchData } from './api';

// Defining TypeScript interfaces helps keep your application typesafe [3]
interface DataItem {
  id: string | number;
  name: string;
}

const DataComponent: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    setLoading(true);
    setError(null); // Reset the error state before retrying
    try {
      const result = await fetchData();
      setData(result);
    } catch (err: any) {
      // Capture and save the error message
      setError(err.message || 'Failed to fetch data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 1. Loading State: Displayed while the API request is in progress
  if (loading) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner name="crescent" />
        <p>Loading records...</p>
      </div>
    );
  }

  // 2. Error State: Keeps the app from crashing and displays what went wrong [1]
  if (error) {
    return (
      <div className="ion-text-center ion-padding">
        <IonIcon icon={alertCircleOutline} color="danger" style={{ fontSize: '48px' }} />
        <IonText color="danger">
          <h2>An Error Occurred</h2>
          <p>{error}</p>
        </IonText>
        <IonButton fill="clear" onClick={getData}>
          <IonIcon slot="start" icon={refreshOutline} />
          Try Again
        </IonButton>
      </div>
    );
  }

  // 3. Empty State: Gracefully handles empty arrays from the API
  if (data.length === 0) {
    return (
      <div className="ion-text-center ion-padding">
        <IonText color="medium">
          <p>No records found.</p>
        </IonText>
      </div>
    );
  }

  // 4. Success State: Displays the data using Ionic elements [1, 2]
  return (
    <IonList>
      {data.map(item => (
        <IonItem key={item.id}>
          <IonLabel>{item.name}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default DataComponent;