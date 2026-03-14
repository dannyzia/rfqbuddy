// Admin hooks — user management, settings, email templates, audit logs

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { adminApi } from '../lib/api/admin.api';
import { toast } from 'sonner';
import type {
  Profile, PaginatedResponse, Tender, EmailTemplate,
  PlatformSetting, ActivityLog, AdminDashboardStats,
} from '../lib/api-types';

// ── Dashboard Stats ────────────────────────────────────────────

export function useAdminStats() {
  return useApiQuery<AdminDashboardStats>(() => adminApi.getStats(), []);
}

// ── User Management ────────────────────────────────────────────

export function useAdminUserList(params?: { page?: number; pageSize?: number }) {
  return useApiQuery<PaginatedResponse<Profile>>(
    () => adminApi.listUsers(params),
    [params?.page, params?.pageSize],
  );
}

export function useAdminCreateUser() {
  return useApiMutation<Profile, Partial<Profile>>(
    async (data) => {
      const result = await adminApi.createUser(data);
      toast.success(`User "${result.full_name}" created`);
      return result;
    },
  );
}

export function useAdminUpdateUser() {
  return useApiMutation<Profile, { id: string; data: Partial<Profile> }>(
    async ({ id, data }) => {
      const result = await adminApi.updateUser(id, data);
      toast.success('User updated');
      return result;
    },
  );
}

export function useAdminApproveUser() {
  return useApiMutation<Profile, string>(
    async (id) => {
      const result = await adminApi.approveUser(id);
      toast.success(`User "${result.full_name}" approved`);
      return result;
    },
  );
}

export function useAdminRejectUser() {
  return useApiMutation<Profile, string>(
    async (id) => {
      const result = await adminApi.rejectUser(id);
      toast.info('User registration rejected');
      return result;
    },
  );
}

export function useAdminDeactivateUser() {
  return useApiMutation<Profile, string>(
    async (id) => {
      const result = await adminApi.deactivateUser(id);
      toast.warning('User deactivated');
      return result;
    },
  );
}

// ── Tender Management ──────────────────────────────────────────

export function useAdminTenderList(params?: { page?: number; pageSize?: number }) {
  return useApiQuery<PaginatedResponse<Tender>>(
    () => adminApi.listTenders(params),
    [params?.page, params?.pageSize],
  );
}

export function useAdminDeleteTender() {
  return useApiMutation<{ success: true }, string>(
    async (id) => {
      const result = await adminApi.deleteTender(id);
      toast.success('Tender deleted');
      return result;
    },
  );
}

// ── Platform Settings ──────────────────────────────────────────

export function usePlatformSettings() {
  return useApiQuery<PlatformSetting[]>(() => adminApi.getSettings(), []);
}

export function useUpdatePlatformSetting() {
  return useApiMutation<PlatformSetting, { key: string; value: string }>(
    async ({ key, value }) => {
      const result = await adminApi.updateSetting(key, value);
      toast.success(`Setting "${key}" updated`);
      return result;
    },
  );
}

// ── Email Templates ────────────────────────────────────────────

export function useEmailTemplates() {
  return useApiQuery<EmailTemplate[]>(() => adminApi.getEmailTemplates(), []);
}

export function useEmailTemplate(key: string | undefined) {
  return useApiQuery<EmailTemplate>(
    () => adminApi.getEmailTemplate(key!),
    [key],
    { enabled: !!key },
  );
}

export function useCreateEmailTemplate() {
  return useApiMutation<EmailTemplate, Partial<EmailTemplate>>(
    async (data) => {
      const result = await adminApi.createEmailTemplate(data);
      toast.success(`Template "${result.key}" created`);
      return result;
    },
  );
}

export function useUpdateEmailTemplate() {
  return useApiMutation<EmailTemplate, { key: string; data: Partial<EmailTemplate> }>(
    async ({ key, data }) => {
      const result = await adminApi.updateEmailTemplate(key, data);
      toast.success('Email template updated');
      return result;
    },
  );
}

export function useDeleteEmailTemplate() {
  return useApiMutation<{ success: true }, string>(
    async (key) => {
      const result = await adminApi.deleteEmailTemplate(key);
      toast.success('Email template deleted');
      return result;
    },
  );
}

// ── Activity Logs ──────────────────────────────────────────────

export function useAllActivityLogs(params?: { page?: number; pageSize?: number }) {
  return useApiQuery<PaginatedResponse<ActivityLog>>(
    () => adminApi.getAllLogs(params),
    [params?.page, params?.pageSize],
  );
}

export function useAdminAuditLogs(params?: { page?: number; pageSize?: number }) {
  return useApiQuery<ActivityLog[]>(
    () => adminApi.getAdminAuditLogs(params),
    [params?.page, params?.pageSize],
  );
}
