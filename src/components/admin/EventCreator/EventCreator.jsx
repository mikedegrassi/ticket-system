import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import './EventCreator.css';

function EventCreator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxTickets, setMaxTickets] = useState('');
  const [genre, setGenre] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [artistId, setArtistId] = useState('');
  const [artists, setArtists] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from('artist').select('id, name');
      if (error) {
        console.error('Fout bij ophalen artiesten:', error);
      } else {
        setArtists(data);
      }
    };

    fetchArtists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.from('events').insert([
      {
        title,
        description,
        date,
        location,
        artist_id: artistId,
        max_tickets: maxTickets,
        genre,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error('Fout bij aanmaken evenement:', error);
      setMessage('Er is iets misgegaan bij het aanmaken van het evenement.');
    } else {
      setMessage('Evenement succesvol aangemaakt!');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setMaxTickets('');
      setGenre('');
      setImageUrl('');
      setArtistId('');
    }
  };

  return (
    <div className="event-creator">
      <h2>Evenement aanmaken</h2>
      <form onSubmit={handleSubmit}>
        <label>Titel:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Beschrijving:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Datum:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Locatie:</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Artiest:</label>
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)} required>
          <option value="">-- Selecteer artiest --</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <label>Max. tickets:</label>
        <input type="number" value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} required />

        <label>Genre:</label>
        <input value={genre} onChange={(e) => setGenre(e.target.value)} required />

        <label>Afbeelding URL:</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

        <button type="submit">Evenement aanmaken</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default EventCreator;
