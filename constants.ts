import { ProcessConfig, ProcessType, RecordItem, Status } from "./types";

export const PROCESS_LIST: ProcessConfig[] = [
  { id: ProcessType.REWARD, label: "Khen thưởng Đảng viên", levels: 1 },
  { id: ProcessType.DISCIPLINE, label: "Kỷ luật Đảng viên", levels: 1 },
  { id: ProcessType.MEMBER_GRADING, label: "Xếp loại Đảng viên", levels: 2 },
  { id: ProcessType.ORG_GRADING, label: "Xếp loại tổ chức Đảng", levels: 1 },
  { id: ProcessType.CONFIRMATION, label: "Công tác chuẩn y", levels: 1 },
  { id: ProcessType.TRANSFER, label: "Chuyển sinh hoạt Đảng", levels: 2 },
  { id: ProcessType.ABROAD, label: "Đi nước ngoài", levels: 2 }, // 2 Levels
  { id: ProcessType.SUPPLEMENTARY, label: "Phiếu bổ sung thông tin", levels: 1 },
];

const randomDate = (start: Date, end: Date) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const BRANCHES = ["Chi bộ 1", "Chi bộ 2", "Chi bộ Kỹ thuật", "Chi bộ Kinh doanh", "Chi bộ Hành chính"];
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

export const TRANSFER_TYPES = [
  "Chuyển sinh hoạt ra ngoài",
  "Chuyển sinh hoạt nội bộ"
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

    // Default Sender (Org Input context)
    item.senderCode = `CB-${100 + i}`;
    item.senderName = item.applicant; 
    item.senderRole = "Bí thư chi bộ"; 
    item.senderBranch = BRANCHES[i % BRANCHES.length];

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
    
    // MEMBER GRADING (Personal)
    if (type === ProcessType.MEMBER_GRADING) {
        item.senderCode = targetCode; item.senderName = targetName; item.senderRole = targetRole; item.senderBranch = targetBranch;
        item.targetMemberCode = targetCode; item.targetMemberName = targetName; item.targetMemberRole = targetRole; item.targetMemberBranch = targetBranch;
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
        item.senderName = "Đại diện " + targetBranch;
        item.senderRole = "Bí thư";
    }

    // CONFIRMATION
    if (type === ProcessType.CONFIRMATION) {
        item.targetMemberCode = targetCode; item.targetMemberName = targetName; item.targetMemberRole = targetRole; item.targetMemberBranch = targetBranch;
        item.currentPartyTitle = "Chi ủy viên"; item.currentDecisionNumber = "123/QĐ-CU-OLD"; item.currentEffectiveDate = "01/01/2023";
        item.confirmationDecisionType = CONFIRMATION_TYPES[i % CONFIRMATION_TYPES.length]; item.newPartyTitle = PARTY_TITLES[i % PARTY_TITLES.length];
        item.newDecisionNumber = `${i}/QĐ-DUVP`; item.newEffectiveDate = item.date; item.confirmationNote = "Kiện toàn nhân sự";
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }

    // TRANSFER (Personal)
    if (type === ProcessType.TRANSFER) {
        item.senderCode = targetCode; item.senderName = targetName; item.senderRole = targetRole; item.senderBranch = targetBranch;
        item.targetMemberCode = targetCode; item.targetMemberName = targetName; item.targetMemberRole = targetRole; item.targetMemberBranch = targetBranch;
        item.currentPartyTitle = targetRole; item.currentDecisionNumber = "123/QĐ-OLD"; item.currentEffectiveDate = "01/01/2020";
        item.transferDecisionType = TRANSFER_TYPES[i % TRANSFER_TYPES.length];
        if (item.transferDecisionType === "Chuyển sinh hoạt nội bộ") {
            item.destinationBranch = BRANCHES[(i + 1) % BRANCHES.length]; item.destinationPartyCommittee = "Đảng ủy Khối";
        } else {
            item.destinationBranch = "Chi bộ Công ty ABC (Ngoài)"; item.destinationPartyCommittee = "Quận ủy Quận 1";
        }
        item.transferDecisionNumber = `${i}/QĐ-CSH`; item.transferEffectiveDate = item.date; item.transferNote = "Chuyển công tác";
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }

    // ABROAD (Personal)
    if (type === ProcessType.ABROAD) {
        // Personal Request
        item.senderCode = targetCode; item.senderName = targetName; item.senderRole = targetRole; item.senderBranch = targetBranch;
        item.targetMemberCode = targetCode; item.targetMemberName = targetName; item.targetMemberRole = targetRole; item.targetMemberBranch = targetBranch;
        
        item.abroadType = "Việc riêng";
        item.abroadPurpose = i % 2 === 0 ? "Du lịch" : "Thăm thân nhân";
        item.abroadDepartDate = randomDate(new Date(2025, 5, 1), new Date(2025, 6, 1));
        item.abroadReturnDate = randomDate(new Date(2025, 6, 2), new Date(2025, 7, 1));
        item.abroadDestination = i % 3 === 0 ? "Nhật Bản" : i % 3 === 1 ? "Hàn Quốc" : "Thái Lan";
        item.abroadBudget = "5,000,000";
        item.abroadNote = "Xin nghỉ phép theo quy định";
        item.memberList = [{ id: targetCode, name: targetName, role: targetRole, branch: targetBranch, dob: "01/01/1990" }];
    }

    // Approval History
    if (status === Status.WAITING_L2) {
      item.level1Result = { approverName: "Lê Thị Bí Thư", approverRole: "Bí thư Chi bộ", actionDate: item.date, comment: "Đồng ý.", result: 'APPROVED' };
    }
    if (status === Status.APPROVED) {
        item.level1Result = { approverName: "Nguyễn Văn Chủ Tịch", approverRole: "Chủ tịch", actionDate: item.date, comment: "Duyệt hồ sơ.", result: 'APPROVED' };
        if (config.levels === 2) {
             item.level2Result = { approverName: "Trần Văn Đảng Ủy", approverRole: "Đảng ủy viên", actionDate: item.date, comment: "Phê duyệt.", result: 'APPROVED' };
        }
    }
    
    data.push(item);
  }
  
  // Specific Test Data for Abroad (Waiting L1)
  data.push({ 
      id: 'REQ-7001', date: '20/08/2025', applicant: 'Phạm Văn G', type: ProcessType.ABROAD, status: Status.WAITING_L1, summary: 'Xin đi du lịch nước ngoài',
      senderCode: 'DV-7001', senderName: 'Phạm Văn G', senderRole: 'Đảng viên dự bị', senderBranch: 'Chi bộ 2',
      targetMemberCode: 'DV-7001', targetMemberName: 'Phạm Văn G', targetMemberRole: 'Đảng viên dự bị', targetMemberBranch: 'Chi bộ 2',
      abroadType: 'Việc riêng', abroadPurpose: 'Du lịch hè', abroadDepartDate: '01/09/2025', abroadReturnDate: '05/09/2025', abroadDestination: 'Singapore', abroadBudget: '5,000,000', abroadNote: '',
      memberList: [{ id: 'DV-7001', name: 'Phạm Văn G', role: 'Đảng viên dự bị', branch: 'Chi bộ 2', dob: '10/10/1992' }]
  });

  // Specific Test Data for Abroad (Waiting L2)
  data.push({ 
      id: 'REQ-7002', date: '18/08/2025', applicant: 'Trần Thị H', type: ProcessType.ABROAD, status: Status.WAITING_L2, summary: 'Xin đi thăm thân',
      senderCode: 'DV-7002', senderName: 'Trần Thị H', senderRole: 'Đảng viên chính thức', senderBranch: 'Chi bộ 1',
      targetMemberCode: 'DV-7002', targetMemberName: 'Trần Thị H', targetMemberRole: 'Đảng viên chính thức', targetMemberBranch: 'Chi bộ 1',
      abroadType: 'Việc riêng', abroadPurpose: 'Thăm con du học', abroadDepartDate: '10/09/2025', abroadReturnDate: '20/09/2025', abroadDestination: 'Úc', abroadBudget: '5,000,000', abroadNote: 'Đã xin phép cơ quan',
      memberList: [{ id: 'DV-7002', name: 'Trần Thị H', role: 'Đảng viên chính thức', branch: 'Chi bộ 1', dob: '05/05/1980' }],
      level1Result: { approverName: "Bí Thư Chi Bộ 1", approverRole: "Bí thư", actionDate: "19/08/2025", comment: "Đồng ý đề xuất", result: 'APPROVED' }
  });

  return data.sort((a, b) => b.id.localeCompare(a.id));
};

export const INITIAL_DATA = generateMockData();