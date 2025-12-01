export enum ViewMode {
  REGISTER = 'REGISTER',
  APPROVAL = 'APPROVAL',
}

export enum ProcessType {
  REWARD = 'REWARD', // Khen thưởng (1 cấp)
  DISCIPLINE = 'DISCIPLINE', // Kỷ luật (1 cấp)
  MEMBER_GRADING = 'MEMBER_GRADING', // Xếp loại ĐV (2 cấp)
  ORG_GRADING = 'ORG_GRADING', // Xếp loại tổ chức (1 cấp)
  CONFIRMATION = 'CONFIRMATION', // Chuẩn y (1 cấp)
  TRANSFER = 'TRANSFER', // Chuyển sinh hoạt (2 cấp)
  ABROAD = 'ABROAD', // Đi nước ngoài (2 cấp)
  SUPPLEMENTARY = 'SUPPLEMENTARY', // Bổ sung thông tin (1 cấp)
}

export enum Status {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  
  // Level 1 specific
  WAITING_L1 = 'WAITING_L1',
  REJECTED_L1 = 'REJECTED_L1',
  
  // Level 2 specific
  WAITING_L2 = 'WAITING_L2',
  REJECTED_L2 = 'REJECTED_L2',
}

export interface ProcessConfig {
  id: ProcessType;
  label: string;
  levels: 1 | 2;
}

export interface ApprovalInfo {
  approverName: string;
  approverRole: string;
  actionDate: string;
  comment: string;
  result: 'APPROVED' | 'REJECTED';
}

export interface PartyMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  dob: string;
}

export interface RecordItem {
  id: string;
  date: string;
  applicant: string;
  type: ProcessType;
  status: Status;
  summary: string; 
  startTime?: string;
  endTime?: string;

  // SENDER INFO (Người gửi/Người tạo yêu cầu)
  senderCode?: string;
  senderName?: string;
  senderRole?: string;
  senderBranch?: string;
  
  // Common Decision Fields
  decisionNumber?: string;
  decisionAgency?: string;
  signDate?: string;

  // Specific fields for Reward
  rewardYear?: string;
  rewardType?: string;
  rewardContent?: string;
  rewardNote?: string;
  
  // Specific fields for Discipline
  disciplineYear?: string;
  disciplineType?: string;
  disciplineContent?: string;
  disciplineNote?: string;

  // Specific fields for Grading
  gradingYear?: string;
  selfGrading?: string;
  proposedGrading?: string;
  finalGrading?: string;
  gradingNote?: string;

  // Specific fields for Confirmation
  currentPartyTitle?: string;
  currentDecisionNumber?: string;
  currentEffectiveDate?: string;
  confirmationDecisionType?: string;
  newPartyTitle?: string;
  newDecisionNumber?: string;
  newEffectiveDate?: string;
  confirmationNote?: string;

  // Specific fields for Transfer
  transferDecisionType?: string;
  destinationBranch?: string;
  destinationPartyCommittee?: string;
  transferDecisionNumber?: string;
  transferEffectiveDate?: string;
  transferNote?: string;

  // Specific fields for Abroad (Đi nước ngoài)
  abroadType?: string;        // Loại chuyển đi (Mặc định: Việc riêng)
  abroadPurpose?: string;     // Mục đích
  abroadDepartDate?: string;  // Ngày đi
  abroadReturnDate?: string;  // Ngày về
  abroadDestination?: string; // Nơi đến
  abroadBudget?: string;      // Kinh phí
  abroadNote?: string;        // Ghi chú

  // Target Member Info (The subject of the request, distinct from Sender)
  targetMemberCode?: string;
  targetMemberName?: string;
  targetMemberRole?: string;
  targetMemberBranch?: string;

  // List of members attached to this request
  memberList?: PartyMember[];

  // History of approvals
  level1Result?: ApprovalInfo;
  level2Result?: ApprovalInfo;
}

export interface TabOption {
  id: string;
  label: string;
  count: number;
  filter: (status: Status) => boolean;
}