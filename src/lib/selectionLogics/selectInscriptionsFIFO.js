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

  const selected = inscriptions.slice(0, maxWinners);

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
