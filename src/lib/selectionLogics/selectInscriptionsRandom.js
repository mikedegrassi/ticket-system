import { supabase } from '../supabaseClient';

export async function selectInscriptionsRandom(eventId, maxTickets) {
  const { data: inscriptions, error } = await supabase
    .from('inscriptions')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'pending');

  if (error) throw new Error(error.message);
  if (!inscriptions || inscriptions.length === 0) return [];

  const shuffled = inscriptions.sort(() => 0.5 - Math.random());

  const selected = [];
  let ticketCounter = 0;

  for (const inscription of shuffled) {
    const expected = inscription.expected_tickets || 1;

    if (ticketCounter + expected <= maxTickets) {
      selected.push(inscription);
      ticketCounter += expected;
    }
  }

  await Promise.all(
    selected.map((i) =>
      supabase
        .from('inscriptions')
        .update({ status: 'selected' })
        .eq('id', i.id)
    )
  );

  return selected;
}
