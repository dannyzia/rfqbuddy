import { api } from '../api-client';
import type { AccessibilityPreferences, SecurityDashboardResponse } from '../api-types';

export const settingsApi = {
  getAccessibility() {
    return api.get<AccessibilityPreferences>('/api/settings/accessibility');
  },

  updateAccessibility(prefs: Partial<AccessibilityPreferences>) {
    return api.put<AccessibilityPreferences>('/api/settings/accessibility', prefs);
  },

  getSecurityDashboard() {
    return api.get<SecurityDashboardResponse>('/api/admin/security');
  },
};
