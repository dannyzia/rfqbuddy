import { api } from '../api-client';
import type { Organization, OrgMember, PaginatedResponse } from '../api-types';

export const orgsApi = {
  list(params?: { type?: string; status?: string; page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<Organization>>('/api/orgs', params);
  },

  getById(id: string) {
    return api.get<Organization & { vendorProfile?: object | null }>(`/api/orgs/${id}`);
  },

  create(data: { name: string; type: 'procuring_entity' | 'vendor'; [k: string]: unknown }) {
    return api.post<Organization>('/api/orgs', data);
  },

  update(id: string, data: Partial<Organization>) {
    return api.patch<Organization>(`/api/orgs/${id}`, data);
  },

  approve(id: string) {
    return api.post<Organization>(`/api/orgs/${id}/approve`);
  },

  reject(id: string) {
    return api.post<Organization>(`/api/orgs/${id}/reject`);
  },

  suspend(id: string) {
    return api.post<Organization>(`/api/orgs/${id}/suspend`);
  },

  // Members
  getMembers(orgId: string) {
    return api.get<OrgMember[]>(`/api/orgs/${orgId}/members`);
  },

  addMember(orgId: string, userId: string, role: string) {
    return api.post(`/api/orgs/${orgId}/members`, { user_id: userId, role });
  },

  removeMember(orgId: string, userId: string) {
    return api.delete(`/api/orgs/${orgId}/members/${userId}`);
  },

  updateMemberRole(orgId: string, userId: string, role: string) {
    return api.patch(`/api/orgs/${orgId}/members/${userId}/role`, { role });
  },
};
