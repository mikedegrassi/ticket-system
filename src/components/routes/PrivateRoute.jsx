import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const session = useSession();

  // Voeg dit toe om te wachten op de sessie-initialisatie
  if (session === undefined) {
    return <div>Bezig met laden...</div>; // of <Loader />
  }

  return session ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

