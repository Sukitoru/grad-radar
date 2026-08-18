import { Route, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ApplicationForm from './pages/ApplicationForm';
import AccountPage from './pages/AccountPage';
import ApplicationsPage from './pages/ApplicationsPage';
import RecentDecisionsPage from './pages/RecentDecisionsPage';
import AppNavigation from './components/AppNavigation';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NewUser from './pages/NewUser'; 
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserInfo from './pages/UserInfo';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import '@ionic/react/css/palettes/dark.class.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <AppNavigation />
        <IonRouterOutlet id="main-content">
          <Route exact path = "/">
          <Redirect to = "/main" />
          </Route>
          <Route exact path = "/main">
          <NewUser/>
          </Route>
          <Route exact path = "/signup">
          <SignUp/>
          </Route>
          <Route exact path = "/grad-credentials">
          <UserInfo/>
          </Route>
          <Route exact path = "/login">
          <Login/>
          </Route>
          <Route exact path = "/home" render = {() => localStorage.getItem('loggedIn') === 'true'
          ? <Home />
          : <Redirect to = "/login"/>
          }
          />
          <Route exact path="/applications/new">
            <ApplicationForm />
          </Route>
          <Route exact path="/applications/:applicationId/edit">
            <ApplicationForm />
          </Route>
          <Route exact path="/applications">
            <ApplicationsPage />
          </Route>
          <Route exact path="/decisions/recent">
            <RecentDecisionsPage />
          </Route>
          <Route exact path="/account" render = {() => localStorage.getItem('loggedIn') === 'true'
            ? <AccountPage/>
            : <Redirect to = "/login"/>
          }
          />
          <Route exact path="/analytics">
            <AnalyticsDashboard />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
