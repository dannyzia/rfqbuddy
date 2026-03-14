import { db } from '../config/database';
import { organizations, orgMembers, profiles, vendorProfiles } from '../schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { auditService } from './audit.service';
import type { RequestUser, PaginatedResponse, Organization } from '../types';

export const orgService = {
  async list(user: RequestUser, filters: {
    type?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Organization>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    let query = db.select().from(organizations).$dynamic();

    // Non-admins can only see their own org
    if (user.role !== 'super_admin') {
      if (user.org_id) {
        query = query.where(eq(organizations.id, user.org_id));
      } else {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
      }
    }

    if (filters.type) {
      query = query.where(eq(organizations.type, filters.type as any));
    }
    if (filters.status) {
      query = query.where(eq(organizations.status, filters.status as any));
    }

    const data = await query.orderBy(desc(organizations.created_at)).limit(pageSize).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(organizations);

    return {
      data: data as Organization[],
      total: Number(count),
      page,
      pageSize,
      totalPages: Math.ceil(Number(count) / pageSize),
    };
  },

  async getById(id: string) {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    if (!org) return null;

    // If vendor, include vendor profile
    let vendorProfile = null;
    if (org.type === 'vendor') {
      const [vp] = await db.select().from(vendorProfiles).where(eq(vendorProfiles.org_id, id)).limit(1);
      vendorProfile = vp ?? null;
    }

    return { ...org, vendorProfile };
  },

  async create(data: {
    name: string;
    type: 'procuring_entity' | 'vendor';
    registration_no?: string;
    tax_id?: string;
    address?: object;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
  }, user: RequestUser) {
    const [org] = await db.insert(organizations).values({
      name: data.name,
      type: data.type,
      registration_no: data.registration_no ?? null,
      tax_id: data.tax_id ?? null,
      address: data.address ?? null,
      contact_email: data.contact_email ?? null,
      contact_phone: data.contact_phone ?? null,
      website: data.website ?? null,
    }).returning();

    // If vendor, create empty vendor profile
    if (data.type === 'vendor') {
      await db.insert(vendorProfiles).values({ org_id: org.id });
    }

    await auditService.log(
      user.id, org.id, 'CREATE_ORG', 'organization', org.id,
      `Created organisation: ${data.name}`,
    );

    return org;
  },

  async update(id: string, data: Partial<Organization>, user: RequestUser) {
    const [updated] = await db.update(organizations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    await auditService.log(
      user.id, id, 'UPDATE_ORG', 'organization', id,
      `Updated organisation: ${updated.name}`,
    );

    return updated;
  },

  async approve(id: string, user: RequestUser) {
    const [updated] = await db.update(organizations)
      .set({ status: 'approved', is_active: true, updated_at: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    // Also approve all pending members
    await db.update(profiles)
      .set({ status: 'approved', updated_at: new Date() })
      .where(and(eq(profiles.org_id, id), eq(profiles.status, 'pending')));

    await auditService.adminLog(user.id, 'APPROVE_ORG', 'organization', id);

    return updated;
  },

  async reject(id: string, user: RequestUser) {
    const [updated] = await db.update(organizations)
      .set({ status: 'rejected', updated_at: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    await auditService.adminLog(user.id, 'REJECT_ORG', 'organization', id);
    return updated;
  },

  async suspend(id: string, user: RequestUser) {
    const [updated] = await db.update(organizations)
      .set({ status: 'suspended', is_active: false, updated_at: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    await auditService.adminLog(user.id, 'SUSPEND_ORG', 'organization', id);
    return updated;
  },

  // ── Member Management ────────────────────────────────────────

  async getMembers(orgId: string) {
    return db.select({
      member_id: orgMembers.id,
      user_id: orgMembers.user_id,
      role: orgMembers.role,
      joined_at: orgMembers.joined_at,
      full_name: profiles.full_name,
      email: profiles.email,
      status: profiles.status,
      is_active: profiles.is_active,
    })
      .from(orgMembers)
      .innerJoin(profiles, eq(profiles.id, orgMembers.user_id))
      .where(eq(orgMembers.org_id, orgId))
      .orderBy(orgMembers.joined_at);
  },

  async addMember(orgId: string, userId: string, role: string, invitedBy: string) {
    const [member] = await db.insert(orgMembers).values({
      org_id: orgId,
      user_id: userId,
      role,
      invited_by: invitedBy,
    }).returning();

    // Update user's org_id
    await db.update(profiles)
      .set({ org_id: orgId, role: role as any, updated_at: new Date() })
      .where(eq(profiles.id, userId));

    return member;
  },

  async removeMember(orgId: string, userId: string, requestUser: RequestUser) {
    // Cannot remove self
    if (userId === requestUser.id) {
      throw new Error('Cannot remove yourself from the organisation.');
    }

    await db.delete(orgMembers)
      .where(and(eq(orgMembers.org_id, orgId), eq(orgMembers.user_id, userId)));

    // Unset user's org_id
    await db.update(profiles)
      .set({ org_id: null, updated_at: new Date() })
      .where(eq(profiles.id, userId));

    await auditService.log(
      requestUser.id, orgId, 'REMOVE_MEMBER', 'org_member', userId,
      `Removed user from organisation`,
    );
  },

  async updateMemberRole(orgId: string, userId: string, newRole: string, requestUser: RequestUser) {
    await db.update(orgMembers)
      .set({ role: newRole })
      .where(and(eq(orgMembers.org_id, orgId), eq(orgMembers.user_id, userId)));

    await db.update(profiles)
      .set({ role: newRole as any, updated_at: new Date() })
      .where(eq(profiles.id, userId));

    await auditService.log(
      requestUser.id, orgId, 'UPDATE_MEMBER_ROLE', 'org_member', userId,
      `Changed role to ${newRole}`,
    );
  },
};
