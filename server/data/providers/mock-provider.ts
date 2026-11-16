/**
 * Provider MOCK — baca seed dari shared/mock, join lewat snapshot-builder.
 * Sumber data saat demo tanpa database; bentuk payload identik dengan
 * provider Supabase (standar data terkunci §4).
 */
import type { WorkerSnapshot } from '#shared/types/worker'
import { cityRows } from '#shared/mock/cities'
import { eoProfileRows } from '#shared/mock/eo-profiles'
import { demoProfileRow, demoWorkerProfileRow } from '#shared/mock/profiles'
import { jobApplicationRows, jobAssignmentRows } from '#shared/mock/job-applications'
import { jobPostRows } from '#shared/mock/job-posts'
import { jobRequirementRows } from '#shared/mock/job-requirements'
import { notificationRows } from '#shared/mock/notifications'
import { competencyRows, workerSkillRows } from '#shared/mock/worker-skills'
import { buildWorkerSnapshot } from '../snapshot-builder'

export const mockProvider = {
  async getWorkerSnapshot(): Promise<WorkerSnapshot> {
    return buildWorkerSnapshot({
      cities: cityRows,
      competencies: competencyRows,
      eoProfiles: eoProfileRows,
      // Worker demo diletakkan pertama agar terpilih sebagai identitas aktif.
      profiles: [demoProfileRow, ...eoProfileRows.map(row => ({
        id: row.user_id,
        auth_user_id: row.user_id,
        name: row.org_name,
        email: `pic@${row.org_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.demo`,
        phone: null,
        photo_url: null,
        status: 'ACTIVE' as const,
        kyc_status: 'APPROVED' as const,
        created_at: row.created_at,
      }))],
      workerProfiles: [demoWorkerProfileRow],
      workerSkills: workerSkillRows,
      jobPosts: jobPostRows,
      jobRequirements: jobRequirementRows,
      jobApplications: jobApplicationRows,
      jobAssignments: jobAssignmentRows,
      notifications: notificationRows,
    })
  },
}
