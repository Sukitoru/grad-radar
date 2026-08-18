import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  addCircleOutline,
  barChartOutline,
  homeOutline,
  listOutline,
  personCircleOutline,
  timeOutline,
} from 'ionicons/icons';

const navigationItems = [
  { label: 'Home', path: '/home', icon: homeOutline },

  {
    label: 'Recent Decisions',
    path: '/decisions/recent',
    icon: timeOutline,
  },

  {
    label: 'Add Application',
    path: '/applications/new',
    icon: addCircleOutline,
  },

  {
    label: 'My Applications',
    path: '/applications',
    icon: listOutline,
  },

  { label: 'Analytics', path: '/analytics', icon: barChartOutline },

  { label: 'Account', path: '/account', icon: personCircleOutline },
];

const AppNavigation: React.FC = () => {
  return (
    <IonMenu menuId="main-navigation" contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grad Radar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>Navigation</IonListHeader>

          {navigationItems.map((item) => (
            <IonMenuToggle key={item.path} autoHide={false}>
              <IonItem
                routerLink={item.path}
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon slot="start" icon={item.icon} aria-hidden="true" />
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default AppNavigation;
