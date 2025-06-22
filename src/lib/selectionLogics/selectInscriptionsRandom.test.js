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

  it('selecteert willekeurige inschrijvingen en update hun status', async () => {
    const mockInscriptions = [
      { id: 1, user_id: 'a' },
      { id: 2, user_id: 'b' },
      { id: 3, user_id: 'c' }
    ];

    // Fake chaining van .select().eq().eq()
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

    const result = await selectInscriptionsRandom(123, 2);

    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(result.length).toBe(2);
    expect(result.every(r => [1, 2, 3].includes(r.id))).toBe(true);
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
