// Barrel export — all domain hooks from one import
// Usage: import { useTenderList, useMyBids, useNotifications } from '../hooks';

// Core data hooks
export * from './use-tenders';
export * from './use-bids';
export * from './use-evaluations';
export * from './use-contracts';
export * from './use-vendors';
export * from './use-orgs';
export * from './use-analytics';
export * from './use-catalogue';
export * from './use-tickets';
export * from './use-storage';
export * from './use-calendar';
export * from './use-admin';

// Realtime hooks
export * from './use-notifications';
export * from './use-realtime';

// Existing prototype hooks
export * from './use-roles';
export * from './use-page-config';
export * from './use-tender-options';
export * from './use-saved-presets';
