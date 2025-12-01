import { ProcessConfig, ProcessType, RecordItem, Status } from "./types";

export const PROCESS_LIST: ProcessConfig[] = [
  { id: ProcessType.REWARD, label: "Khen thưởng Đảng viên", levels: 1 },
  { id: ProcessType.DISCIPLINE, label: "Kỷ luật Đảng viên", levels: 1 },
  { id: ProcessType.MEMBER_GRADING, label: "Xếp loại Đảng viên", levels: 2 },
  { id: ProcessType.ORG_GRADING, label: "Xếp loại tổ chức Đảng", levels: 1 },
  { id: ProcessType.CONFIRMATION, label: "Công tác chuẩn y", levels: 1 }, // 1 Level
  { id: ProcessType.TRANSFER, label: "Chuyển sinh hoạt Đảng", levels: 2 },
  { id: ProcessType.ABROAD, label: "Đi nước ngoài", levels: 2 },
  { id: ProcessType.SUPPLEMENTARY, label: "Phiếu bổ sung thông tin", levels: 1 },
];

const randomDate = (start: Date, end: Date) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BRANCHES = ["Chi bộ 1", "Chi bộ 2", "Chi bộ Kỹ thuật", "Chi bộ Kinh doanh", "Chi bộ Hành chính"];
const ROLES = ["Đảng viên chính thức", "Đảng viên dự bị", "Bí thư chi bộ", "Phó bí thư"];
const REWARD_TYPES = ["Biểu dương", "Giấy khen", "Bằng khen", "Huy hiệu 30 năm", "Chiến sĩ thi đua"];
const DISCIPLINE_TYPES = ["Khiển trách", "Cảnh cáo", "Cách chức", "Khai trừ", "Giải tán"];
const DECISION_AGENCIES = ["Đảng ủy Khối doanh nghiệp", "Đảng ủy Tập đoàn", "Đảng ủy cơ sở"];

export const GRADING_OPTIONS = [
  "Hoàn thành xuất sắc nhiệm vụ",
  "Hoàn thành tốt nhiệm vụ",
  "Hoàn thành nhiệm vụ",
  "Không hoàn thành nhiệm vụ",
  "Không xếp loại"
];

export const ORG_GRADING_OPTIONS = [
  "Hoàn thành xuất sắc nhiệm vụ",
  "Hoàn thành tốt nhiệm vụ",
  "Hoàn thành nhiệm vụ",
  "Không hoàn thành nhiệm vụ"
];

export const CONFIRMATION_TYPES = [
  "Chuẩn y kết quả Đại hội",
  "Kiện toàn cấp ủy",
  "Điều chỉnh chức danh cấp ủy"
];

export const PARTY_TITLES = [
  "Bí thư chi bộ",
  "Phó bí thư chi bộ",
  "Chi ủy viên"
];

export const generateMockData = (): RecordItem[] => {
  const data: RecordItem[] = [];
  const types = Object.values(ProcessType);
  
  const statuses1Level = [
    Status.WAITING, Status.WAITING, Status.WAITING,
    Status.APPROVED, 
    Status.REJECTED, 
    Status.CANCELLED
  ];
  
  const statuses2Level = [
    Status.WAITING_L1, Status.WAITING_L1, Status.WAITING_L1,
    Status.WAITING_L2, Status.WAITING_L2,
    Status.APPROVED, 
    Status.REJECTED_L1, 
    Status.REJECTED_L2, 
    Status.CANCELLED
  ];

  for (let i = 1; i <= 60; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const config = PROCESS_LIST.find(p => p.id === type)!;
    
    let status;
    if (config.levels === 1) {
      status = statuses1Level[Math.floor(Math.random() * statuses1Level.length)];
    } else {
      status = statuses2Level[Math.floor(Math.random() * statuses2Level.length)];
    }

    const item: RecordItem = {
      id: `REQ-${1000 + i}`,
      date: randomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
      applicant: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
      type: type,
      status: status,
      summary: "Hồ sơ xử lý yêu cầu",
      startTime: "08:00",
      endTime: "17:00"
    };

    const targetCode = `DV-${2000 + i}`;
    const targetName = `Đảng viên ${String.fromCharCode(65 + (i % 26))} ${i}`;
    const targetRole = ROLES[i % ROLES.length];
    const targetBranch = BRANCHES[i % BRANCHES.length];

    // ... (REWARD, DISCIPLINE, GRADING, ORG_GRADING logic same as before) ...
    // REWARD
    if (type === ProcessType.REWARD) {
       item.targetMemberCode = targetCode;
       item.targetMemberName = targetName;
       item.targetMemberRole = targetRole;
       item.targetMemberBranch = targetBranch;
       item.rewardYear = "2025";
       item.decisionNumber = `${i}/QĐ-KT`;
       item.decisionAgency = DECISION_AGENCIES[i % DECISION_AGENCIES.length];
       item.rewardType = REWARD_TYPES[i % REWARD_TYPES.length];
       item.rewardContent = "Thành tích xuất sắc";
       item.signDate = item.date;
       item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }
    // DISCIPLINE
    if (type === ProcessType.DISCIPLINE) {
        item.targetMemberCode = targetCode;
        item.targetMemberName = targetName;
        item.targetMemberRole = targetRole;
        item.targetMemberBranch = targetBranch;
        item.disciplineYear = "2025";
        item.decisionNumber = `${i}/QĐ-KL`;
        item.decisionAgency = DECISION_AGENCIES[i % DECISION_AGENCIES.length];
        item.disciplineType = DISCIPLINE_TYPES[i % DISCIPLINE_TYPES.length];
        item.disciplineContent = "Vi phạm quy chế";
        item.signDate = item.date;
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }
    // MEMBER GRADING
    if (type === ProcessType.MEMBER_GRADING) {
        item.targetMemberCode = targetCode;
        item.targetMemberName = targetName;
        item.targetMemberRole = targetRole;
        item.targetMemberBranch = targetBranch;
        item.gradingYear = "2025";
        item.selfGrading = GRADING_OPTIONS[1];
        if (status === Status.WAITING_L2) item.proposedGrading = item.selfGrading;
        if (status === Status.APPROVED) { item.proposedGrading = item.selfGrading; item.finalGrading = item.selfGrading; }
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }
    // ORG GRADING
    if (type === ProcessType.ORG_GRADING) {
        item.applicant = targetBranch; 
        item.gradingYear = "2025";
        item.selfGrading = ORG_GRADING_OPTIONS[1];
        if (status === Status.APPROVED) item.finalGrading = item.selfGrading;
    }

    // CONFIRMATION (New Logic)
    if (type === ProcessType.CONFIRMATION) {
        item.targetMemberCode = targetCode;
        item.targetMemberName = targetName;
        item.targetMemberRole = targetRole;
        item.targetMemberBranch = targetBranch;
        
        // Mock current info
        item.currentPartyTitle = "Chi ủy viên";
        item.currentDecisionNumber = "123/QĐ-CU-OLD";
        item.currentEffectiveDate = "01/01/2023";

        // Mock new info
        item.confirmationDecisionType = CONFIRMATION_TYPES[i % CONFIRMATION_TYPES.length];
        item.newPartyTitle = PARTY_TITLES[i % PARTY_TITLES.length];
        item.newDecisionNumber = `${i}/QĐ-DUVP`;
        item.newEffectiveDate = item.date;
        item.confirmationNote = "Kiện toàn nhân sự";
        
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }

    // Approval History
    if (status === Status.WAITING_L2) {
      item.level1Result = { approverName: "Lê Thị Bí Thư", approverRole: "Bí thư Chi bộ", actionDate: item.date, comment: "Đồng ý chuyển.", result: 'APPROVED' };
    }
    if (status === Status.APPROVED) {
        // Generic approved history for all
        item.level1Result = { approverName: "Nguyễn Văn Chủ Tịch", approverRole: "Chủ tịch", actionDate: item.date, comment: "Duyệt hồ sơ.", result: 'APPROVED' };
        if (config.levels === 2) {
             item.level2Result = { approverName: "Trần Văn Đảng Ủy", approverRole: "Đảng ủy viên", actionDate: item.date, comment: "Phê duyệt.", result: 'APPROVED' };
        }
    }
    
    data.push(item);
  }
  
  // Specific Test Data for Confirmation
  data.push({ 
      id: 'REQ-5001', 
      date: '12/08/2025', 
      applicant: 'Chi bộ 3', 
      type: ProcessType.CONFIRMATION, 
      status: Status.WAITING, 
      summary: 'Kiện toàn cấp ủy chi bộ 3',
      
      targetMemberCode: 'DV-5001',
      targetMemberName: 'Hoàng Văn E',
      targetMemberRole: 'Đảng viên chính thức',
      targetMemberBranch: 'Chi bộ 3',
      
      currentPartyTitle: 'Chi ủy viên',
      currentDecisionNumber: '99/QĐ-CU',
      currentEffectiveDate: '15/05/2022',
      
      confirmationDecisionType: 'Kiện toàn cấp ủy',
      newPartyTitle: 'Phó bí thư chi bộ',
      newDecisionNumber: '101/QĐ-DUVP',
      newEffectiveDate: '20/08/2025',
      confirmationNote: 'Bổ sung chức danh phó bí thư',
      
      memberList: [{ id: 'DV-5001', name: 'Hoàng Văn E', role: 'Đảng viên chính thức', branch: 'Chi bộ 3', dob: '12/12/1988' }]
  });

  return data.sort((a, b) => b.id.localeCompare(a.id));
};

export const INITIAL_DATA = generateMockData();