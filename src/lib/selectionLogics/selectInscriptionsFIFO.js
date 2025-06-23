import { supabase } from '../supabaseClient';

export async function selectInscriptionsFIFO(eventId, maxWinners) {
  const { data: inscriptions, error } = await supabase
    .from('inscriptions')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!inscriptions || inscriptions.length === 0) return [];

  const selected = [];
  let ticketCounter = 0;

  for (const inscription of inscriptions) {
    const expected = inscription.expected_tickets || 1;

    if (ticketCounter + expected <= maxWinners) {
      selected.push(inscription);
      ticketCounter += expected;
    } else {
      break;
    }
  }

  await Promise.all(
    selected.map(ins =>
      supabase
        .from('inscriptions')
        .update({ status: 'selected' })
        .eq('id', ins.id)
    )
  );

  return selected;
}
