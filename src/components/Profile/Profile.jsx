import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './Profile.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error) {
          setProfile({ ...data, email: user.email });
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Profiel laden...</p>;
  if (!profile) return <p>Geen profiel gevonden.</p>;

  return (
    <div className="profile-page">
      <h2>Mijn Profiel</h2>
      <ul>
        <li><strong>Voornaam:</strong> {profile.first_name}</li>
        <li><strong>Tussenvoegsel:</strong> {profile.middle_name || '-'}</li>
        <li><strong>Achternaam:</strong> {profile.last_name}</li>
        <li><strong>E-mailadres:</strong> {profile.email}</li>
        <li><strong>Telefoonnummer:</strong> {profile.phone_number}</li>
      </ul>
    </div>
  );
}

export default ProfilePage;
