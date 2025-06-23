import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import './ArtistCreator.css';

export default function ArtistCreator() {
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateArtist = async () => {
    setSuccess(false);
    setError(null);

    const { error } = await supabase.from('artist').insert([
      {
        name: artistName,
        bio,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setArtistName('');
      setBio('');
      setImageUrl('');
    }
  };

  return (
    <div className="artist-form">
      <h2>Nieuwe artiest aanmaken</h2>
      <input
        type="text"
        placeholder="Naam"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="input"
        rows="4"
      />
      <input
        type="text"
        placeholder="Afbeelding-URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="input"
      />
      <button onClick={handleCreateArtist} className="btn">
        Artiest toevoegen
      </button>
      {success && <p className="success">Artiest toegevoegd!</p>}
      {error && <p className="error">❌ {error}</p>}
    </div>
  );
}

