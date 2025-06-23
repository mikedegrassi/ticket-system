import { selectInscriptionsFIFO } from '../selectionLogics/selectInscriptionsFIFO';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => {
  const updateMock = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({}) });
  const fromMock = jest.fn();

  return {
    supabase: {
      from: fromMock,
      __mocks: {
        fromMock,
        updateMock
      }
    }
  };
});

describe('selectInscriptionsFIFO', () => {
  const { fromMock, updateMock } = supabase.__mocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selecteert inschrijvingen totdat expected_tickets limiet is bereikt en update status', async () => {
    const mockInscriptions = [
      { id: 1, user_id: 'a', expected_tickets: 2, created_at: '2023-01-01T10:00:00Z' },
      { id: 2, user_id: 'b', expected_tickets: 3, created_at: '2023-01-01T10:01:00Z' },
      { id: 3, user_id: 'c', expected_tickets: 2, created_at: '2023-01-01T10:02:00Z' }
    ];

    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: mockInscriptions, error: null })
          })
        })
      }),
      update: () => ({
        eq: updateMock
      })
    });

    const result = await selectInscriptionsFIFO(123, 5); // limiet is 5 tickets

    // Verwacht dat user 1 en 2 geselecteerd zijn (2 + 3 = 5)
    expect(result).toEqual([
      { id: 1, user_id: 'a', expected_tickets: 2, created_at: '2023-01-01T10:00:00Z' },
      { id: 2, user_id: 'b', expected_tickets: 3, created_at: '2023-01-01T10:01:00Z' }
    ]);

    expect(updateMock).toHaveBeenCalledTimes(2);
  });

  it('geeft lege array als er geen inschrijvingen zijn', async () => {
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      update: () => ({
        eq: jest.fn()
      })
    });

    const result = await selectInscriptionsFIFO(456, 3);
    expect(result).toEqual([]);
  });

  it('gooit een fout als Supabase faalt', async () => {
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({
              data: null,
              error: new Error('Supabase kapot')
            })
          })
        })
      })
    });

    await expect(selectInscriptionsFIFO(789, 3)).rejects.toThrow('Supabase kapot');
  });
});
