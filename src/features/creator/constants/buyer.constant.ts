import type { EmailTemplate } from '../types/buyerEmailDrawer.types';

export const TEMPLATES: EmailTemplate[] = [
  {
    id: 'thank_you',
    icon: '🎉',
    label: 'Thank you',
    description: 'Send a warm thank-you to buyers after their purchase.',
    defaultSubject: 'Thank you for your purchase!',
    defaultBody:
      'Hey {name},\n\nJust wanted to say a genuine thank you for your support. It means a lot.\n\nIf you have any questions or feedback, just hit reply — I read every message.',
  },
  {
    id: 'reengagement',
    icon: '💌',
    label: 'We miss you',
    description: `Win back buyers who haven't purchased in a while.`,
    defaultSubject: `Hey {name}, it's been a while!`,
    defaultBody:
      `Hey {name},\n\nIt's been a while since we last heard from you. I've been working on some new things I think you'll love.\n\nCome take a look — I'd love to have you back.`,
  },
  {
    id: 'discount',
    icon: '🏷️',
    label: 'Discount offer',
    description: 'Send a personal coupon to reward loyal customers.',
    defaultSubject: 'A special offer just for you, {name}',
    defaultBody:
      'Hey {name},\n\nAs a valued customer I want to give you something special. Use the code below at checkout for a discount on your next order.\n\nEnjoy!',
    extras: 'coupon',
  },
  {
    id: 'new_product',
    icon: '🚀',
    label: 'New product',
    description: 'Notify buyers about a new product drop.',
    defaultSubject: 'Something new just dropped 🚀',
    defaultBody:
      `Hey {name},\n\nI've been working on something new and you're among the first to know.\n\nCheck it out before I announce it publicly — early access is yours.`,
    extras: 'product',
  },
  {
    id: 'custom',
    icon: '✏️',
    label: 'Write from scratch',
    description: 'Compose a fully custom email to your buyers.',
    defaultSubject: '',
    defaultBody: '',
  },
];

export const CUSTOM_TEMPLATE = TEMPLATES.find((t) => t.id === 'custom')!;
export const STANDARD_TEMPLATES = TEMPLATES.filter((t) => t.id !== 'custom');