import type { BuyerRow } from '../types/buyer.types';
import type { BuyerAction } from '../types/buyerEmailDrawer.types';

export function buyerReducer(state: BuyerRow[], action: BuyerAction): BuyerRow[] {
  switch (action.type) {
    case 'RESET':  return action.buyers;
    case 'REMOVE': return state.filter((b) => b.buyer_id !== action.id);
  }
}