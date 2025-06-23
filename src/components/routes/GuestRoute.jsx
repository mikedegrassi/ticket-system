import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

function GuestRoute({ children }) {
  const session = useSession();

  if (session === undefined) {
    return <div>Bezig met laden...</div>;
  }

  return session ? <Navigate to="/" /> : children;
}

export default GuestRoute;

