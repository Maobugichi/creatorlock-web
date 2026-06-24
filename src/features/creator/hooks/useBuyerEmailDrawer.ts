'use client';

import { useState, useReducer, useRef, useCallback, useEffect } from 'react';
import { useSendBuyerEmail } from '../api/useBuyerSend';
import { useToast } from '@/features/creator/hooks/useToast';
import { buyerReducer } from './useBuyerReducer';
import type { BuyerRow } from '../types/buyer.types';
import type { DrawerStage, EmailTemplate } from '../types/buyerEmailDrawer.types';

export interface UseBuyerEmailDrawerReturn {
  // Stage
  stage: DrawerStage;
  setStage: (stage: DrawerStage) => void;

  // Template
  selectedTemplate: EmailTemplate | null;
  handleSelectTemplate: (template: EmailTemplate) => void;

  // Buyers
  activeBuyers: BuyerRow[];
  handleRemoveBuyer: (id: string) => void;

  // Fields
  subject: string;
  setSubject: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  couponCode: string;
  setCouponCode: (v: string) => void;
  productTitle: string;
  setProductTitle: (v: string) => void;
  productUrl: string;
  setProductUrl: (v: string) => void;

  // Send
  handleSend: () => Promise<void>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;

  // Derived
  canSend: boolean;
  bodyCount: number;

  // Refs
  drawerRef: React.RefObject<HTMLDivElement | null>;
}

export function useBuyerEmailDrawer(
  open: boolean,
  initialBuyers: BuyerRow[],
  onClose: () => void,
  onSendSuccess: () => void,
): UseBuyerEmailDrawerReturn {
  const { sendEmailAsync, isPending, isError, error, reset } = useSendBuyerEmail();
  const { show: showToast } = useToast();

  // ─── State ───────────────────────────────────────────────────────────────

  const [stage, setStage]                       = useState<DrawerStage>('pick');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [activeBuyers, dispatch]                = useReducer(buyerReducer, initialBuyers);
  const [subject, setSubject]                   = useState('');
  const [body, setBody]                         = useState('');
  const [couponCode, setCouponCode]             = useState('');
  const [productTitle, setProductTitle]         = useState('');
  const [productUrl, setProductUrl]             = useState('');

  // ─── Refs ─────────────────────────────────────────────────────────────────

  const prevOpenRef = useRef(false);
  const triggerRef  = useRef<HTMLElement | null>(null);
  const drawerRef   = useRef<HTMLDivElement>(null);

  // ─── Open / close lifecycle ───────────────────────────────────────────────

  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    const justClosed = !open && prevOpenRef.current;
    prevOpenRef.current = open;

    if (justOpened) {
      dispatch({ type: 'RESET', buyers: initialBuyers });
      triggerRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => drawerRef.current?.focus());
    }

    if (justClosed) {
      const t = setTimeout(() => {
        setStage('pick');
        setSelectedTemplate(null);
        setSubject('');
        setBody('');
        setCouponCode('');
        setProductTitle('');
        setProductUrl('');
        reset();
        triggerRef.current?.focus();
        triggerRef.current = null;
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open, initialBuyers, reset]);

  // ─── Escape key ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, isPending, onClose]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectTemplate = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.defaultSubject);
    setBody(template.defaultBody);
    setStage('compose');
  }, []);

  const handleRemoveBuyer = useCallback((id: string) => {
    const remaining = activeBuyers.filter((b) => b.buyer_id !== id);
    if (remaining.length === 0) { onClose(); return; }
    dispatch({ type: 'REMOVE', id });
  }, [activeBuyers, onClose]);

  const handleSend = useCallback(async () => {
    if (!selectedTemplate || activeBuyers.length === 0 || isPending) return;

    await sendEmailAsync(
      {
        buyerIds:     activeBuyers.map((b) => b.buyer_id),
        template:     selectedTemplate.id,
        subject,
        body,
        ...(couponCode   && { couponCode }),
        ...(productTitle && { productTitle }),
        ...(productUrl   && { productUrl }),
      },
      {
        onSuccess: () => {
          setStage('success');
          onSendSuccess();
          showToast(
            'Email queued!',
            'success',
            `Sending to ${activeBuyers.length} buyer${activeBuyers.length !== 1 ? 's' : ''} via Resend.`,
          );
        },
        onError: () => {
          showToast(
            'Email queued!',
            'success',
            `Sending to ${activeBuyers.length} buyer${activeBuyers.length !== 1 ? 's' : ''} via Resend.`,
          );
        },
      },
    );
  }, [
    selectedTemplate, activeBuyers, isPending,
    sendEmailAsync, subject, body,
    couponCode, productTitle, productUrl,
    onSendSuccess, showToast,
  ]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const bodyCount = body.length;
  const canSend =
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    activeBuyers.length > 0 &&
    !isPending;

  return {
    stage,
    setStage,
    selectedTemplate,
    handleSelectTemplate,
    activeBuyers,
    handleRemoveBuyer,
    subject,
    setSubject,
    body,
    setBody,
    couponCode,
    setCouponCode,
    productTitle,
    setProductTitle,
    productUrl,
    setProductUrl,
    handleSend,
    isPending,
    isError,
    error: error ?? null,
    canSend,
    bodyCount,
    drawerRef,
  };
}