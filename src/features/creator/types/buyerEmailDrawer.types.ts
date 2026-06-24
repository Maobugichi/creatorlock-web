import type { BuyerEmailTemplate, BuyerRow } from '../types/buyer.types';

export interface EmailTemplate {
  id: BuyerEmailTemplate;
  icon: string;
  label: string;
  description: string;
  defaultSubject: string;
  defaultBody: string;
  extras?: 'coupon' | 'product';
}

export interface BuyerEmailDrawerProps {
  open: boolean;
  buyers: BuyerRow[];
  onClose: () => void;
  onSendSuccess: () => void;
}

export type DrawerStage = 'pick' | 'compose' | 'success';

export type BuyerAction =
  | { type: 'RESET'; buyers: BuyerRow[] }
  | { type: 'REMOVE'; id: string };