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
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { isAuthenticated, rememberRequestedPath } from './authSession';

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

const protectedPage = (page: React.ReactNode, requestedPath: string) => {
  if (isAuthenticated()) {
    return page;
  }

  rememberRequestedPath(requestedPath);
  return <Redirect to="/login" />;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <AppNavigation />
        <IonRouterOutlet id="main-content">
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/signup"
            render={() =>
              isAuthenticated() ? <Redirect to="/" /> : <SignUp />
            }
          />
          <Route
            exact
            path="/login"
            render={() =>
              isAuthenticated() ? <Redirect to="/" /> : <Login />
            }
          />
          <Route
            exact
            path="/applications/new"
            render={({ location }) =>
              protectedPage(<ApplicationForm />, location.pathname)
            }
          />
          <Route
            exact
            path="/applications/:applicationId/edit"
            render={({ location }) =>
              protectedPage(<ApplicationForm />, location.pathname)
            }
          />
          <Route
            exact
            path="/applications"
            render={({ location }) =>
              protectedPage(<ApplicationsPage />, location.pathname)
            }
          />
          <Route
            exact
            path="/decisions/recent"
            render={({ location }) =>
              protectedPage(<RecentDecisionsPage />, location.pathname)
            }
          />
          <Route
            exact
            path="/account"
            render={({ location }) =>
              protectedPage(<AccountPage />, location.pathname)
            }
          />
          <Route
            exact
            path="/analytics"
            render={({ location }) =>
              protectedPage(<AnalyticsDashboard />, location.pathname)
            }
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
