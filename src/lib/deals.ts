import type { Deal } from '@/payload-types'

import { getClient } from './payload'
import { isActiveDeal } from './pricing'

export const getActiveDeals = async (where: Record<string, unknown> = {}): Promise<Deal[]> => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'deals',
    where: where as never,
    limit: 100,
    depth: 1,
    pagination: false,
    sort: 'order',
  })
  const now = new Date()
  return docs.filter((deal) => isActiveDeal(deal, now))
}

export const getDomesticDeals = async (): Promise<Deal[]> => {
  const deals = await getActiveDeals({ category: { equals: 'hotels' } })
  return deals.filter((deal) => /국내/.test(`${deal.title} ${deal.conditions ?? ''}`))
}
