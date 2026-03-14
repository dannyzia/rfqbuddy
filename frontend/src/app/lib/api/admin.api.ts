import { api } from '../api-client';
import type { Profile, PaginatedResponse, Tender, EmailTemplate, PlatformSetting, ActivityLog, AdminDashboardStats } from '../api-types';

export const adminApi = {
  // Dashboard
  getStats() {
    return api.get<AdminDashboardStats>('/api/admin/stats');
  },

  // User management
  listUsers(params?: { page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<Profile>>('/api/admin/users', params);
  },

  createUser(data: Partial<Profile>) {
    return api.post<Profile>('/api/admin/users', data);
  },

  updateUser(id: string, data: Partial<Profile>) {
    return api.patch<Profile>(`/api/admin/users/${id}`, data);
  },

  approveUser(id: string) {
    return api.post<Profile>(`/api/admin/users/${id}/approve`);
  },

  rejectUser(id: string) {
    return api.post<Profile>(`/api/admin/users/${id}/reject`);
  },

  deactivateUser(id: string) {
    return api.delete<Profile>(`/api/admin/users/${id}`);
  },

  // Tender management
  listTenders(params?: { page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<Tender>>('/api/admin/tenders', params);
  },

  deleteTender(id: string) {
    return api.delete<{ success: true }>(`/api/admin/tenders/${id}`);
  },

  // Platform settings
  getSettings() {
    return api.get<PlatformSetting[]>('/api/admin/settings');
  },

  updateSetting(key: string, value: string) {
    return api.put<PlatformSetting>(`/api/admin/settings/${key}`, { value });
  },

  // Email templates
  getEmailTemplates() {
    return api.get<EmailTemplate[]>('/api/admin/email-templates');
  },

  getEmailTemplate(key: string) {
    return api.get<EmailTemplate>(`/api/admin/email-templates/${key}`);
  },

  createEmailTemplate(data: Partial<EmailTemplate>) {
    return api.post<EmailTemplate>('/api/admin/email-templates', data);
  },

  updateEmailTemplate(key: string, data: Partial<EmailTemplate>) {
    return api.patch<EmailTemplate>(`/api/admin/email-templates/${key}`, data);
  },

  deleteEmailTemplate(key: string) {
    return api.delete<{ success: true }>(`/api/admin/email-templates/${key}`);
  },

  // Activity logs
  getAllLogs(params?: { page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<ActivityLog>>('/api/activity-logs/all', params);
  },

  getAdminAuditLogs(params?: { page?: number; pageSize?: number }) {
    return api.get<ActivityLog[]>('/api/activity-logs/admin-audit', params);
  },
};
