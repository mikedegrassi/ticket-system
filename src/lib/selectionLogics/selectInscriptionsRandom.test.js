import { selectInscriptionsRandom } from '../selectionLogics/selectInscriptionsRandom';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => {
  const eqMock = jest.fn();
  const updateMock = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({}) });
  const fromMock = jest.fn();

  return {
    supabase: {
      from: fromMock,
      __mocks: {
        fromMock,
        eqMock,
        updateMock
      }
    }
  };
});

describe('selectInscriptionsRandom', () => {
  const { fromMock, updateMock } = supabase.__mocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selecteert inschrijvingen totdat expected_tickets limiet is bereikt en update status', async () => {
    const mockInscriptions = [
      { id: 1, user_id: 'a', expected_tickets: 4 },
      { id: 2, user_id: 'b', expected_tickets: 4 },
      { id: 3, user_id: 'c', expected_tickets: 2 }
    ];

    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: mockInscriptions, error: null })
        })
      }),
      update: () => ({
        eq: updateMock
      })
    });

    const result = await selectInscriptionsRandom(123, 6); // Maximaal 6 tickets beschikbaar

    const totalTickets = result.reduce((sum, r) => sum + (r.expected_tickets || 1), 0);

    expect(totalTickets).toBeLessThanOrEqual(6);
    expect(updateMock).toHaveBeenCalledTimes(result.length);
    expect(result.every(r => mockInscriptions.map(i => i.id).includes(r.id))).toBe(true);
  });

  it('geeft lege array als er geen inschrijvingen zijn', async () => {
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      }),
      update: () => ({
        eq: jest.fn()
      })
    });

    const result = await selectInscriptionsRandom(123, 2);
    expect(result).toEqual([]);
  });

  it('gooit een fout als Supabase faalt', async () => {
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: null, error: new Error('Supabase faalt') })
        })
      })
    });

    await expect(selectInscriptionsRandom(123, 2)).rejects.toThrow('Supabase faalt');
  });
});
