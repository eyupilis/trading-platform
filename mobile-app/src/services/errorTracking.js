import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

export const initErrorTracking = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: __DEV__,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Native.ReactNativeTracing({
        routingInstrumentation: new Sentry.Native.ReactNavigationInstrumentation(),
      }),
    ],
  });

  // Set user information if available
  const user = {
    id: Constants.installationId,
  };
  Sentry.Native.setUser(user);

  // Set app version
  Sentry.Native.setTag('app.version', Constants.manifest.version);
};

export const captureError = (error, context = {}) => {
  if (__DEV__) {
    console.error('Error:', error);
    console.log('Context:', context);
  }
  
  Sentry.Native.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (message, level = 'info') => {
  if (__DEV__) {
    console.log(`${level.toUpperCase()}: ${message}`);
  }

  Sentry.Native.captureMessage(message, level);
};

export const startTransaction = (name, operation) => {
  return Sentry.Native.startTransaction({
    name,
    op: operation,
  });
};

export const setUserContext = (user) => {
  Sentry.Native.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.username,
  } : null);
};

export const addBreadcrumb = (breadcrumb) => {
  Sentry.Native.addBreadcrumb(breadcrumb);
};
