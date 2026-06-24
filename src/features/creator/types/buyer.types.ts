export interface BuyerRow {
  buyer_id: string;
  name: string;
  email: string;
  total_purchases: string;
  total_spent_cents: string;
  last_purchase_at: string;
}



export type BuyerEmailTemplate =
  | "thank_you"
  | "reengagement"
  | "discount"
  | "new_product"
  | "custom";