import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const session = useSession();

  if (session === undefined) {
    return <div>Bezig met laden...</div>;
  }

  return session ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

