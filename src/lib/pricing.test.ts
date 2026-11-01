import { describe, expect, it } from 'vitest'

import { isActiveDeal } from './pricing'

describe('isActiveDeal', () => {
  const now = new Date('2026-11-01T00:00:00Z')
  it('keeps deals with no end date', () => expect(isActiveDeal({}, now)).toBe(true))
  it('removes ended deals', () => expect(isActiveDeal({ endsAt: '2026-10-31' }, now)).toBe(false))
  it('hides deals that have not started', () =>
    expect(isActiveDeal({ startsAt: '2026-11-10' }, now)).toBe(false))
  it('keeps a deal through its final day', () =>
    expect(isActiveDeal({ endsAt: '2026-11-01' }, new Date('2026-11-01T20:00:00Z'))).toBe(true))
})
