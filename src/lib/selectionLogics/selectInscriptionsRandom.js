import { supabase } from '../supabaseClient';

export async function selectInscriptionsRandom(eventId, maxWinners) {
  const { data: inscriptions, error } = await supabase
    .from('inscriptions')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'pending');

  if (error) throw error;
  if (!inscriptions || inscriptions.length === 0) return [];

  // Shuffle de lijst
  const shuffled = inscriptions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, maxWinners);

  // Update status
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