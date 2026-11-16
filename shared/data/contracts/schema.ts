/**
 * KONTRAK DATA LENGKAP — 67 tabel Supabase PEKERJA EVENT (GENERATED).
 * Dibangun otomatis dari dump skema produksi via scripts/generate-contracts.ts.
 * JANGAN edit manual — ubah generatornya, lalu regenerate.
 *
 * Union status domain worker (ProfileStatus, JobStatus, dst.) direuse dari
 * shared/constants/enums.ts agar tidak ada dua sumber kebenaran.
 */

import type {
  ProfileStatus,
  KycStatus,
  TrainingStatus,
  JobMechanism,
  JobStatus,
  JobCategory,
  JobApplicationStatus,
  AssignmentStatus,
  AllocationStatus,
  SkillSource,
  SkillStatus,
  LedgerSide,
} from '#shared/constants/enums'

export type RolesCode
  = | 'worker'
    | 'eo'
    | 'instructor'
    | 'admin'
    | 'vendor'

export type VerificationRequestsType
  = | 'IDENTITY'
    | 'ORGANIZATION'
    | 'INSTRUCTOR'
    | 'VENDOR'

export type VerificationRequestsStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'

export type TrainingsFormat
  = | 'ONLINE'
    | 'OFFLINE'
    | 'HYBRID'

export type TrainingRegistrationsStatus
  = | 'REGISTERED'
    | 'ATTENDING'
    | 'PASSED'
    | 'FAILED'
    | 'CANCELLED'

export type TrainingRegistrationsPaymentStatus
  = | 'UNPAID'
    | 'PENDING'
    | 'PAID'
    | 'REFUNDED'

export type TrainingAttendancesStatus
  = | 'PRESENT'
    | 'ABSENT'

export type TrainingAssessmentsResult
  = | 'PASS'
    | 'FAIL'

export type ReviewsContextType
  = | 'ASSIGNMENT'
    | 'TRAINING'

export type ReportsStatus
  = | 'OPEN'
    | 'REVIEWING'
    | 'RESOLVED'
    | 'DISMISSED'

export type ModerationActionsAction
  = | 'APPROVE'
    | 'REJECT'
    | 'TAKE_DOWN'
    | 'RESTORE'

export type VendorMembersRoleInVendor
  = | 'OWNER'
    | 'PIC'

export type RfqsStatus
  = | 'DRAFT'
    | 'SENT'
    | 'CLOSED'
    | 'CANCELLED'

export type RfqInvitationsStatus
  = | 'INVITED'
    | 'RESPONDED'
    | 'DECLINED'

export type QuotationsStatus
  = | 'DRAFT'
    | 'SUBMITTED'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'EXPIRED'
    | 'WITHDRAWN'

export type PurchaseOrdersStatus
  = | 'ISSUED'
    | 'CONFIRMED'
    | 'IN_DELIVERY'
    | 'COMPLETED'
    | 'CANCELLED'

export type ContractsStatus
  = | 'DRAFT'
    | 'SIGNED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'TERMINATED'

export type DeliveriesStatus
  = | 'PENDING'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'VERIFIED'
    | 'FAILED'

export type VendorPaymentsStatus
  = | 'UNPAID'
    | 'PROOF_SUBMITTED'
    | 'CONFIRMED'

export type CommissionInvoicesStatus
  = | 'UNPAID'
    | 'SENT'
    | 'PAID'
    | 'VOID'

export type PaymentProfilesVerificationStatus
  = | 'PENDING'
    | 'VERIFIED'
    | 'REJECTED'

export type EventPaymentOrdersInvoiceStatus
  = | 'ISSUED'
    | 'PAID'
    | 'CANCELLED'

export type EventPaymentOrdersSettlementMode
  = | 'PLATFORM_QRIS'
    | 'EO_DIRECT'

export type PaymentTransactionsTransactionStatus
  = | 'PENDING'
    | 'SUCCEEDED'
    | 'FAILED'
    | 'EXPIRED'
    | 'CANCELLED'

export type AssignmentVerificationsEoStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'

export type AssignmentVerificationsAdminStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'

export type AssignmentPayoutExceptionsResolutionStatus
  = | 'PENDING'
    | 'CLOSED_NO_PAYOUT'

export type EventPayoutReleasesReleaseStatus
  = | 'BLOCKED'
    | 'READY'
    | 'RELEASED'

export type WorkerPayoutsPayoutStatus
  = | 'PREPARED'
    | 'TRANSFERRED'
    | 'CONFIRMED'
    | 'FAILED'
    | 'CANCELLED'

export type WorkerPayoutsPayerRole
  = | 'PLATFORM'
    | 'EO'

export type WorkerPayoutsPaymentMethod
  = | 'QRIS'
    | 'TRANSFER'

export type KycDocumentsDocumentType
  = | 'KTP_PHOTO'
    | 'SELFIE_KTP'

export type KycDocumentsVerificationStatus
  = | 'PENDING'
    | 'VERIFIED'
    | 'REJECTED'

export type KycSocialAccountsPlatform
  = | 'INSTAGRAM'
    | 'FACEBOOK'

export type KycSocialAccountsVerificationStatus
  = | 'SUBMITTED'
    | 'VERIFIED'
    | 'REJECTED'

export type KycReviewsDecision
  = | 'APPROVED'
    | 'REJECTED'

export type CertificatesStatus
  = | 'ACTIVE'
    | 'REVOKED'

export type NotificationDeliveriesChannel
  = | 'IN_APP'
    | 'EMAIL'
    | 'WHATSAPP'

export type NotificationDeliveriesStatus
  = | 'PENDING'
    | 'SENT'
    | 'FAILED'
    | 'SKIPPED'

export type CompetencyAssessmentsMethod
  = | 'PRACTICAL'
    | 'PORTFOLIO'
    | 'INTERVIEW'
    | 'WRITTEN'

export type CompetencyAssessmentsStatus
  = | 'PENDING'
    | 'PASSED'
    | 'FAILED'
    | 'CANCELLED'

export type EventFeeInvoicesStatus
  = | 'UNPAID'
    | 'PAID'
    | 'VOID'

export type TrainingMaterialsMaterialType
  = | 'FILE'
    | 'LINK'
    | 'VIDEO'
    | 'DOCUMENT'

export type InstructorWithdrawalsMethod
  = | 'QRIS'
    | 'TRANSFER'

export type InstructorWithdrawalsStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'TRANSFERRED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'CANCELLED'

export type CourseRefundsRequesterRole
  = | 'WORKER'
    | 'INSTRUCTOR'
    | 'ADMIN'

export type CourseRefundsStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'TRANSFERRED'
    | 'REJECTED'
    | 'CANCELLED'

export type BankWebhookEventsEventType
  = | 'TRAINING_SETTLE'
    | 'EVENT_SETTLE'
    | 'FEE_SETTLE'
    | 'PAYOUT_SETTLE'

export type BankWebhookEventsProcessStatus
  = | 'RECEIVED'
    | 'PROCESSED'
    | 'REJECTED'
    | 'DUPLICATE'

export type PayoutBatchesStatus
  = | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED'

export type PaymentApprovalsContextType
  = | 'WITHDRAWAL'
    | 'PAYOUT_BATCH'

export type PaymentApprovalsStatus
  = | 'PENDING'
    | 'APPROVED'
    | 'VOIDED'

export type LedgerAccountsAccountType
  = | 'ASSET'
    | 'LIABILITY'
    | 'REVENUE'

export type LedgerEntriesContextType
  = | 'COURSE_PAID'
    | 'COURSE_REFUND'
    | 'WITHDRAWAL_APPROVED'
    | 'WITHDRAWAL_REJECTED_REVERSAL'
    | 'WITHDRAWAL_TRANSFERRED'

export interface CitiesRow {
  id: string
  created_at: string
  name: string
  province: string
}

export interface CompetenciesRow {
  id: string
  created_at: string
  code: string
  name: string
  description: string | null
  is_active: boolean
}

export interface RolesRow {
  id: string
  created_at: string
  code: RolesCode
  name: string
}

export interface ProfilesRow {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  photo_url: string | null
  status: ProfileStatus
  auth_user_id: string | null
  kyc_status: KycStatus
}

export interface UserRolesRow {
  id: string
  created_at: string
  user_id: string
  role_id: string
}

export interface WorkerProfilesRow {
  id: string
  created_at: string
  user_id: string
  city_id: string | null
  bio: string | null
  skills: string | null
  portfolio_url: string | null
  desired_positions: string | null
  expected_wage: number | null
  is_verified: boolean
}

export interface EoProfilesRow {
  id: string
  created_at: string
  user_id: string
  org_name: string
  description: string | null
  address: string | null
  is_verified: boolean
}

export interface InstructorProfilesRow {
  id: string
  created_at: string
  user_id: string
  institution_name: string | null
  expertise: string | null
  is_verified: boolean
}

export interface VerificationRequestsRow {
  id: string
  created_at: string
  user_id: string
  type: VerificationRequestsType
  document_url: string
  note: string | null
  status: VerificationRequestsStatus
  reviewed_by_id: string | null
  review_note: string | null
  reviewed_at: string | null
}

export interface DocumentsRow {
  id: string
  created_at: string
  owner_id: string
  type: string
  name: string | null
  url: string
}

export interface TrainingsRow {
  id: string
  created_at: string
  owner_id: string
  competency_id: string | null
  title: string
  description: string | null
  format: TrainingsFormat
  location_name: string | null
  city_id: string | null
  start_date: string | null
  end_date: string | null
  quota: number | null
  price: number
  is_free: boolean
  passing_criteria: string | null
  status: TrainingStatus
  image_url: string | null
  moderation_note: string | null
  moderated_at: string | null
  moderated_by_id: string | null
}

export interface TrainingSessionsRow {
  id: string
  created_at: string
  training_id: string
  date: string
  start_time: string | null
  end_time: string | null
  topic: string | null
  meeting_url: string | null
}

export interface TrainingRegistrationsRow {
  id: string
  created_at: string
  training_id: string
  worker_id: string
  status: TrainingRegistrationsStatus
  payment_status: TrainingRegistrationsPaymentStatus
  payment_method: string | null
  payment_reference: string | null
  payment_proof_url: string | null
  paid_at: string | null
  payment_payload: string | null
  payment_expires_at: string | null
  fee_rate: number | null
  fee_amount: number | null
  net_amount: number | null
}

export interface TrainingAttendancesRow {
  id: string
  created_at: string
  session_id: string
  registration_id: string
  status: TrainingAttendancesStatus
  recorded_at: string
}

export interface TrainingAssessmentsRow {
  id: string
  created_at: string
  registration_id: string
  score: number | null
  result: TrainingAssessmentsResult
  notes: string | null
  assessed_by_id: string | null
  assessed_at: string | null
}

export interface JobPostsRow {
  id: string
  created_at: string
  /** FK job_posts_eo_id_fkey → profiles(id) — id profile akun EO (bukan id baris eo_profiles). */
  eo_id: string
  title: string
  description: string | null
  event_name: string
  event_date: string
  start_time: string | null
  end_time: string | null
  city_id: string | null
  location_name: string | null
  wage: number
  slot_count: number
  mechanism: JobMechanism
  dress_code: string | null
  briefing_note: string | null
  requirements_note: string | null
  status: JobStatus
  image_url: string | null
  duration_days: number
  category: JobCategory
  moderation_note: string | null
  moderated_at: string | null
  moderated_by_id: string | null
}

export interface JobRequirementsRow {
  id: string
  created_at: string
  job_post_id: string
  competency_id: string
  is_required: boolean
}

export interface JobApplicationsRow {
  id: string
  created_at: string
  job_post_id: string
  worker_id: string
  status: JobApplicationStatus
  note: string | null
  decided_at: string | null
}

export interface JobAssignmentsRow {
  id: string
  created_at: string
  job_post_id: string
  worker_id: string
  status: AssignmentStatus
  applied_via: JobMechanism
  cancel_reason: string | null
  completed_at: string | null
  checked_in_at: string | null
  checked_out_at: string | null
}

export interface NotificationsRow {
  id: string
  created_at: string
  user_id: string
  type: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  channels: string
}

export interface ReviewsRow {
  id: string
  created_at: string
  reviewer_id: string
  reviewee_id: string
  context_type: ReviewsContextType
  context_id: string
  rating: number
  comment: string | null
}

export interface ReportsRow {
  id: string
  created_at: string
  reporter_id: string
  target_type: string
  target_id: string | null
  reason: string
  status: ReportsStatus
  handled_by_id: string | null
  resolution_note: string | null
}

export interface AuditLogsRow {
  id: string
  created_at: string
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  meta: string | null
}

export interface ModerationActionsRow {
  id: string
  created_at: string
  admin_id: string
  action: ModerationActionsAction
  target_type: string
  target_id: string
  reason: string
}

export interface PlatformSettingsRow {
  id: string
  created_at: string
  updated_at: string
  key: string
  value: string
  updated_by_id: string | null
}

export interface VendorProfilesRow {
  id: string
  created_at: string
  updated_at: string
  owner_id: string
  org_name: string
  description: string | null
  address: string | null
  is_verified: boolean
}

export interface VendorMembersRow {
  id: string
  created_at: string
  vendor_profile_id: string
  user_id: string
  role_in_vendor: VendorMembersRoleInVendor
  is_primary_contact: boolean
}

export interface VendorCategoriesRow {
  id: string
  created_at: string
  name: string
  slug: string
  description: string | null
}

export interface VendorCategoryMapRow {
  id: string
  created_at: string
  vendor_profile_id: string
  vendor_category_id: string
}

export interface VendorCatalogItemsRow {
  id: string
  created_at: string
  updated_at: string
  vendor_profile_id: string
  name: string
  description: string | null
  unit: string | null
  base_price: number
  is_active: boolean
}

export interface RfqsRow {
  id: string
  created_at: string
  updated_at: string
  rfq_number: string
  eo_id: string
  event_name: string
  event_date: string | null
  location_name: string | null
  city_id: string | null
  notes: string | null
  reply_deadline: string | null
  status: RfqsStatus
}

export interface RfqInvitationsRow {
  id: string
  created_at: string
  rfq_id: string
  vendor_profile_id: string
  status: RfqInvitationsStatus
  invited_at: string
}

export interface QuotationsRow {
  id: string
  created_at: string
  updated_at: string
  quotation_number: string
  rfq_id: string
  vendor_profile_id: string
  total_amount: number
  notes: string | null
  status: QuotationsStatus
  submitted_at: string | null
  decided_at: string | null
}

export interface QuotationItemsRow {
  id: string
  created_at: string
  quotation_id: string
  catalog_item_id: string | null
  name: string
  qty: number
  unit: string | null
  unit_price: number
  subtotal: number
}

export interface PurchaseOrdersRow {
  id: string
  created_at: string
  updated_at: string
  po_number: string
  quotation_id: string
  eo_id: string
  vendor_profile_id: string
  total_amount: number
  status: PurchaseOrdersStatus
  issued_at: string | null
}

export interface PurchaseOrderItemsRow {
  id: string
  created_at: string
  purchase_order_id: string
  name: string
  qty: number
  unit_price: number
  subtotal: number
}

export interface ContractsRow {
  id: string
  created_at: string
  updated_at: string
  contract_number: string
  purchase_order_id: string
  document_url: string | null
  status: ContractsStatus
  signed_at: string | null
}

export interface DeliveriesRow {
  id: string
  created_at: string
  updated_at: string
  purchase_order_id: string
  vendor_profile_id: string
  scheduled_date: string | null
  status: DeliveriesStatus
  delivered_at: string | null
  notes: string | null
}

export interface DeliveryItemsRow {
  id: string
  created_at: string
  delivery_id: string
  name: string
  qty: number
  condition: string | null
}

export interface VendorPaymentsRow {
  id: string
  created_at: string
  updated_at: string
  purchase_order_id: string
  vendor_profile_id: string
  amount: number
  method: string | null
  proof_url: string | null
  paid_at: string | null
  status: VendorPaymentsStatus
}

export interface CommissionInvoicesRow {
  id: string
  created_at: string
  updated_at: string
  invoice_number: string
  purchase_order_id: string
  eo_id: string
  vendor_profile_id: string
  base_amount: number
  rate: number
  amount: number
  status: CommissionInvoicesStatus
  due_date: string | null
  paid_at: string | null
}

export interface PeMigrationsRow {
  name: string
  applied_at: string
}

export interface PaymentProfilesRow {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  bank_code: string
  bank_name: string
  account_holder_name: string
  account_number: string
  bank_book_photo_url: string | null
  qris_photo_url: string | null
  qris_merchant_name: string | null
  verification_status: PaymentProfilesVerificationStatus
  verified_by_id: string | null
  verified_at: string | null
  verification_note: string | null
  qris_payload: string | null
  qris_nmid: string | null
  qris_acquirer: string | null
}

export interface EventPaymentOrdersRow {
  id: string
  created_at: string
  updated_at: string
  invoice_number: string
  job_post_id: string
  eo_id: string
  gross_amount: number
  paid_amount: number
  invoice_status: EventPaymentOrdersInvoiceStatus
  issued_at: string
  paid_at: string | null
  notes: string | null
  settlement_mode: EventPaymentOrdersSettlementMode
}

export interface PaymentTransactionsRow {
  id: string
  created_at: string
  updated_at: string
  payment_order_id: string
  provider_key: string
  provider_transaction_id: string | null
  amount: number
  transaction_status: PaymentTransactionsTransactionStatus
  qris_payload: string | null
  expires_at: string | null
  paid_at: string | null
}

export interface AssignmentVerificationsRow {
  id: string
  created_at: string
  updated_at: string
  assignment_id: string
  eo_status: AssignmentVerificationsEoStatus
  eo_verified_by_id: string | null
  eo_verified_at: string | null
  eo_note: string | null
  admin_status: AssignmentVerificationsAdminStatus
  admin_approved_by_id: string | null
  admin_approved_at: string | null
  admin_note: string | null
}

export interface AssignmentPayoutExceptionsRow {
  id: string
  created_at: string
  updated_at: string
  assignment_id: string
  resolution_status: AssignmentPayoutExceptionsResolutionStatus
  resolution_note: string | null
  resolved_by_id: string | null
  resolved_at: string | null
}

export interface WorkerPaymentAllocationsRow {
  id: string
  created_at: string
  updated_at: string
  payment_order_id: string
  assignment_id: string
  worker_id: string
  gross_amount: number
  platform_fee_rate: number
  platform_fee_amount: number
  worker_net_amount: number
  allocation_status: AllocationStatus
}

export interface EventPayoutReleasesRow {
  id: string
  created_at: string
  updated_at: string
  payment_order_id: string
  release_status: EventPayoutReleasesReleaseStatus
  total_assignments: number
  approved_assignments: number
  exception_assignments: number
  blocked_reasons: string | null
  approved_by_id: string | null
  approved_at: string | null
  released_at: string | null
  notes: string | null
}

export interface WorkerPayoutsRow {
  id: string
  created_at: string
  updated_at: string
  payment_order_id: string
  allocation_id: string
  worker_id: string
  payment_profile_id: string | null
  beneficiary_bank_code: string
  beneficiary_bank_name: string
  beneficiary_account_holder: string
  beneficiary_account_number: string
  payout_amount: number
  payout_status: WorkerPayoutsPayoutStatus
  transfer_reference: string | null
  transfer_proof_url: string | null
  transferred_by_id: string | null
  confirmed_by_id: string | null
  confirmed_at: string | null
  failure_note: string | null
  notes: string | null
  payer_role: WorkerPayoutsPayerRole
  payment_method: WorkerPayoutsPaymentMethod
  transferred_at: string | null
  worker_confirmed_at: string | null
}

export interface KycProfilesRow {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  full_name: string
  nik_cipher: string
  nik_hash: string
  place_of_birth: string | null
  date_of_birth: string | null
  address: string | null
  consent_version: string
  consent_at: string
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by_id: string | null
  rejection_reason: string | null
}

export interface KycDocumentsRow {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  document_type: KycDocumentsDocumentType
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  verification_status: KycDocumentsVerificationStatus
  ocr_meta: string | null
  reviewed_by_id: string | null
  reviewed_at: string | null
}

export interface KycSocialAccountsRow {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  platform: KycSocialAccountsPlatform
  username: string
  profile_url: string | null
  verification_status: KycSocialAccountsVerificationStatus
}

export interface KycReviewsRow {
  id: string
  created_at: string
  user_id: string
  reviewer_id: string
  decision: KycReviewsDecision
  notes: string | null
}

export interface CertificatesRow {
  id: string
  created_at: string
  updated_at: string
  certificate_number: string
  worker_id: string
  registration_id: string
  training_id: string
  competency_id: string | null
  title: string
  issued_by_id: string
  issued_at: string
  status: CertificatesStatus
  revoked_by_id: string | null
  revoked_at: string | null
  revoked_note: string | null
}

export interface NotificationDeliveriesRow {
  id: string
  created_at: string
  updated_at: string
  notification_id: string
  channel: NotificationDeliveriesChannel
  status: NotificationDeliveriesStatus
  detail: string | null
}

export interface WorkerSkillsRow {
  id: string
  created_at: string
  updated_at: string
  worker_id: string
  competency_id: string
  source: SkillSource
  status: SkillStatus
  verified_by: string | null
  verified_at: string | null
}

export interface CompetencyAssessmentsRow {
  id: string
  created_at: string
  updated_at: string
  worker_id: string
  competency_id: string
  requested_note: string | null
  method: CompetencyAssessmentsMethod
  status: CompetencyAssessmentsStatus
  assessor_id: string | null
  score: number | null
  result_note: string | null
  decided_at: string | null
}

export interface EventFeeInvoicesRow {
  id: string
  created_at: string
  updated_at: string
  fee_invoice_number: string
  payment_order_id: string
  eo_id: string
  base_amount: number
  rate: number
  amount: number
  status: EventFeeInvoicesStatus
  proof_path: string | null
  paid_via: string | null
  paid_at: string | null
  resolved_by_id: string | null
  notes: string | null
}

export interface TrainingMaterialsRow {
  id: string
  created_at: string
  updated_at: string
  training_id: string
  session_id: string | null
  title: string
  material_type: TrainingMaterialsMaterialType
  url: string | null
  storage_path: string | null
  sort_order: number
  is_downloadable: boolean
}

export interface InstructorWithdrawalsRow {
  id: string
  created_at: string
  updated_at: string
  withdrawal_number: string
  instructor_id: string
  training_id: string | null
  amount: number
  method: InstructorWithdrawalsMethod
  payment_profile_id: string | null
  bank_name: string | null
  account_number: string | null
  account_holder: string | null
  status: InstructorWithdrawalsStatus
  note: string | null
  processed_by_id: string | null
  processed_at: string | null
  confirmed_at: string | null
  payout_batch_id: string | null
}

export interface CourseRefundsRow {
  id: string
  created_at: string
  updated_at: string
  refund_number: string
  registration_id: string
  training_id: string
  instructor_id: string
  worker_id: string
  requested_by_id: string
  requester_role: CourseRefundsRequesterRole
  amount: number
  fee_reversal: number
  net_reversal: number
  reason: string
  status: CourseRefundsStatus
  note: string | null
  processed_by_id: string | null
  processed_at: string | null
  transfer_reference: string | null
  transferred_at: string | null
}

export interface BankWebhookEventsRow {
  id: string
  created_at: string
  provider_key: string
  event_type: BankWebhookEventsEventType
  raw_body: string
  source_ip: string | null
  process_status: BankWebhookEventsProcessStatus
  related_id: string | null
  error_note: string | null
  processed_at: string | null
}

export interface PayoutBatchesRow {
  id: string
  created_at: string
  updated_at: string
  batch_number: string
  created_by_id: string
  item_count: number
  total_amount: number
  status: PayoutBatchesStatus
  needs_checker: boolean
  approved_by_id: string | null
  approved_at: string | null
  note: string | null
}

export interface PaymentApprovalsRow {
  id: string
  created_at: string
  updated_at: string
  context_type: PaymentApprovalsContextType
  context_id: string
  maker_id: string
  maker_note: string | null
  checker_id: string | null
  checker_note: string | null
  amount: number
  status: PaymentApprovalsStatus
  decided_at: string | null
}

export interface LedgerAccountsRow {
  id: string
  created_at: string
  code: string
  name: string
  account_type: LedgerAccountsAccountType
  is_active: boolean
}

export interface LedgerEntriesRow {
  id: string
  created_at: string
  context_type: LedgerEntriesContextType
  context_id: string
  account_id: string
  side: LedgerSide
  amount: number
  memo: string | null
}
