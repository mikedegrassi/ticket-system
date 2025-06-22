// src/lib/selectionLogics/selectionInscriptionsFIFO.test.js
import { selectInscriptionsFIFO } from '../selectionLogics/selectInscriptionsFIFO';
import { supabase } from '../supabaseClient';

// ✅ Mock Supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}));

describe('selectInscriptionsFIFO', () => {
  it('selecteert eerste inschrijvingen en update hun status', async () => {
    // 🔢 Arrange: gesimuleerde inschrijvingen
    const mockInscriptions = [
      { id: 1, user_id: 'a', created_at: '2023-01-01T10:00:00Z' },
      { id: 2, user_id: 'b', created_at: '2023-01-01T10:05:00Z' },
      { id: 3, user_id: 'c', created_at: '2023-01-01T10:10:00Z' }
    ];

    const selectMock = jest.fn().mockResolvedValue({ data: mockInscriptions, error: null });
    const updateMock = jest.fn().mockResolvedValue({});

    // 🔧 Supabase chain voor select + update
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: selectMock
          })
        })
      }),
      update: () => ({
        eq: updateMock
      })
    });

    // 🧪 Act
    const result = await selectInscriptionsFIFO(123, 2);

    // ✅ Assert: juiste records geselecteerd
    expect(selectMock).toHaveBeenCalled();

    // ✅ Assert: update twee keer uitgevoerd (voor 2 winnaars)
    expect(updateMock).toHaveBeenCalledTimes(2);

    // ✅ Assert: de juiste ID's zijn gebruikt voor update
    expect(updateMock).toHaveBeenCalledWith('id', 1);
    expect(updateMock).toHaveBeenCalledWith('id', 2);

    // ✅ Assert: output is de eerste 2 inschrijvingen
    expect(result).toEqual([
      { id: 1, user_id: 'a', created_at: '2023-01-01T10:00:00Z' },
      { id: 2, user_id: 'b', created_at: '2023-01-01T10:05:00Z' }
    ]);
  });

  it('geeft lege array als er geen inschrijvingen zijn', async () => {
    // 🔧 Simuleer lege inschrijvingenlijst
    const selectMock = jest.fn().mockResolvedValue({ data: [], error: null });

    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: selectMock
          })
        })
      }),
      update: () => ({
        eq: jest.fn() // Geen update nodig
      })
    });

    // 🧪 Act + ✅ Assert
    const result = await selectInscriptionsFIFO(456, 5);
    expect(result).toEqual([]);
  });

  it('gooit een fout als Supabase faalt', async () => {
    // 🔧 Simuleer Supabase fout
    const selectMock = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Supabase kapot')
    });

    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: selectMock
          })
        })
      })
    });

    // 🧪 Act + ✅ Assert: expect throw
    await expect(selectInscriptionsFIFO(789, 3)).rejects.toThrow('Supabase kapot');
  });
});
