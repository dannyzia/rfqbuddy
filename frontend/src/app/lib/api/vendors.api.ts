import { api } from '../api-client';
import type { Organization } from '../api-types';

export const vendorsApi = {
  list() {
    return api.get<Organization[]>('/api/vendors');
  },

  getProfile(orgId: string) {
    return api.get<{ organization: Organization; vendorProfile: any }>(`/api/vendors/${orgId}`);
  },

  submitEnlistment(data: { buyer_org_id: string; submitted_data: object }) {
    return api.post('/api/vendors/enlistment', data);
  },

  reviewEnlistment(enlistmentId: string, approved: boolean) {
    return api.patch(`/api/vendors/enlistment/${enlistmentId}`, { approved });
  },

  submitReview(data: {
    vendor_org_id: string; contract_id?: string;
    quality_score: string; delivery_score: string; communication_score: string;
    comments?: string; review_period?: string;
  }) {
    return api.post(`/api/vendors/${data.vendor_org_id}/reviews`, data);
  },

  getReviews(orgId: string) {
    return api.get(`/api/vendors/${orgId}/reviews`);
  },

  getSRM(orgId: string) {
    return api.get<{ srm_score: number }>(`/api/vendors/${orgId}/srm`);
  },
};
