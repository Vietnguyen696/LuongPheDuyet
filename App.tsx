import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { StatusBadge } from './components/StatusBadge';
import { DetailModal } from './components/DetailModal';
import { RewardModal } from './components/RewardModal';
import { DisciplineModal } from './components/DisciplineModal';
import { GradingModal } from './components/GradingModal';
import { OrgGradingModal } from './components/OrgGradingModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { TransferModal } from './components/TransferModal';
import { AbroadModal } from './components/AbroadModal'; // Import Abroad Modal
import { PROCESS_LIST, INITIAL_DATA } from './constants';
import { ViewMode, ProcessType, Status, RecordItem, TabOption, ApprovalInfo } from './types';
import { ChevronRight, ChevronLeft, Plus, Ban } from 'lucide-react';

const PAGE_SIZE = 10;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.REGISTER);
  const [selectedProcessId, setSelectedProcessId] = useState<ProcessType>(ProcessType.REWARD);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('TOTAL');
  const [data, setData] = useState<RecordItem[]>(INITIAL_DATA);
  
  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Derived Values
  const selectedProcess = PROCESS_LIST.find(p => p.id === selectedProcessId)!;
  const isTwoLevel = selectedProcess.levels === 2;

  // Filter Data based on Process Type
  const processData = useMemo(() => {
    return data.filter(item => item.type === selectedProcessId);
  }, [data, selectedProcessId]);

  // Generate Status Tabs
  const statusTabs: TabOption[] = useMemo(() => {
    const baseTabs = [
      { id: 'TOTAL', label: 'Tất cả', count: processData.length, filter: () => true }
    ];

    let tabs: TabOption[] = [];

    if (!isTwoLevel) {
      tabs = [
        ...baseTabs,
        { id: 'WAITING', label: 'Chờ phê duyệt', count: processData.filter(d => d.status === Status.WAITING).length, filter: (s) => s === Status.WAITING },
        { id: 'APPROVED', label: 'Đã duyệt', count: processData.filter(d => d.status === Status.APPROVED).length, filter: (s) => s === Status.APPROVED },
        { id: 'REJECTED', label: 'Từ chối', count: processData.filter(d => d.status === Status.REJECTED).length, filter: (s) => s === Status.REJECTED },
        { id: 'CANCELLED', label: 'Đã hủy', count: processData.filter(d => d.status === Status.CANCELLED).length, filter: (s) => s === Status.CANCELLED },
      ];
    } else {
      tabs = [
        ...baseTabs,
        { id: 'WAITING_L1', label: 'Chờ phê duyệt cấp 1', count: processData.filter(d => d.status === Status.WAITING_L1).length, filter: (s) => s === Status.WAITING_L1 },
        { id: 'WAITING_L2', label: 'Chờ phê duyệt cấp 2', count: processData.filter(d => d.status === Status.WAITING_L2).length, filter: (s) => s === Status.WAITING_L2 },
        { id: 'APPROVED', label: 'Đã duyệt', count: processData.filter(d => d.status === Status.APPROVED).length, filter: (s) => s === Status.APPROVED },
        { id: 'REJECTED_L1', label: 'Từ chối cấp 1', count: processData.filter(d => d.status === Status.REJECTED_L1).length, filter: (s) => s === Status.REJECTED_L1 },
        { id: 'REJECTED_L2', label: 'Từ chối cấp 2', count: processData.filter(d => d.status === Status.REJECTED_L2).length, filter: (s) => s === Status.REJECTED_L2 },
        { id: 'CANCELLED', label: 'Đã hủy', count: processData.filter(d => d.status === Status.CANCELLED).length, filter: (s) => s === Status.CANCELLED },
      ];
    }

    if (viewMode === ViewMode.APPROVAL) {
      return tabs.filter(t => t.id !== 'CANCELLED');
    }

    return tabs;
  }, [processData, isTwoLevel, viewMode]);

  // Filter Data based on Selected Status Tab
  const filteredData = useMemo(() => {
    const currentTab = statusTabs.find(t => t.id === selectedStatusTab);
    if (!currentTab) return processData;
    if (!statusTabs.some(t => t.id === selectedStatusTab)) {
        return processData;
    }
    return processData.filter(item => currentTab.filter(item.status));
  }, [processData, selectedStatusTab, statusTabs]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Helper to create approval info object
  const createApprovalInfo = (comment: string, result: 'APPROVED' | 'REJECTED'): ApprovalInfo => {
      const today = new Date();
      return {
          approverName: "Nguyễn Văn A (Tôi)",
          approverRole: "Cán bộ quản lý",
          actionDate: `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`,
          comment: comment || (result === 'APPROVED' ? "Đồng ý" : "Không đạt yêu cầu"),
          result: result
      };
  };

  // Actions
  const handleApprove = (id: string, comment: string = '', dataPayload?: any) => {
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newInfo = createApprovalInfo(comment, 'APPROVED');
      if (isTwoLevel && item.status === Status.WAITING_L1) {
        return { ...item, ...dataPayload, status: Status.WAITING_L2, level1Result: newInfo }; 
      }
      if (isTwoLevel && item.status === Status.WAITING_L2) {
          return { ...item, ...dataPayload, status: Status.APPROVED, level2Result: newInfo }
      }
      return { ...item, ...dataPayload, status: Status.APPROVED, level1Result: newInfo }; 
    }));
    setSelectedRecord(null);
  };

  const handleReject = (id: string, comment: string = '') => {
    if (!comment.trim()) { alert("Vui lòng nhập lý do từ chối"); return; }
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newInfo = createApprovalInfo(comment, 'REJECTED');
      if (isTwoLevel && item.status === Status.WAITING_L1) return { ...item, status: Status.REJECTED_L1, level1Result: newInfo };
      if (isTwoLevel && item.status === Status.WAITING_L2) return { ...item, status: Status.REJECTED_L2, level2Result: newInfo };
      return { ...item, status: Status.REJECTED, level1Result: newInfo };
    }));
    setSelectedRecord(null);
  };

  const handleCancel = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: Status.CANCELLED } : item));
  };

  const handleCreateNew = () => {
    if ([ProcessType.REWARD, ProcessType.DISCIPLINE, ProcessType.MEMBER_GRADING, ProcessType.ORG_GRADING, ProcessType.CONFIRMATION, ProcessType.TRANSFER, ProcessType.ABROAD].includes(selectedProcessId)) {
       setIsCreateModalOpen(true);
    } else {
       alert("Tính năng đang phát triển cho quy trình này");
    }
  };

  // Styles helpers
  const getTabStyles = (tabId: string, isSelected: boolean) => isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100';
  const getTabCountStyles = (tabId: string, isSelected: boolean) => isSelected ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500';

  // --- RENDER TABLE HEADER ---
  const renderTableHeader = () => {
      const thStyle = "p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap";
      const cbStyle = "p-4 w-12 text-center";

      // Helper to render Sender Columns
      const renderSenderColumns = () => (
          <>
            <th className={thStyle}>Mã ĐV</th>
            <th className={thStyle}>Họ tên</th>
            <th className={thStyle}>Chi bộ</th>
            <th className={thStyle}>Chức danh</th>
          </>
      );

      // Reward, Discipline, Confirmation, Org Grading -> Always show Sender columns (Org Input)
      if ([ProcessType.REWARD, ProcessType.DISCIPLINE, ProcessType.ORG_GRADING, ProcessType.CONFIRMATION].includes(selectedProcessId)) {
          return (
              <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className={cbStyle}><input type="checkbox" className="w-4 h-4 rounded border-gray-300" onClick={(e) => e.stopPropagation()} /></th>
                  <th className={thStyle}>Trạng thái</th>
                  <th className={thStyle}>Ngày gửi</th>
                  <th className={thStyle}>Mã ĐV (Người gửi)</th>
                  <th className={thStyle}>Họ tên (Người gửi)</th>
                  <th className={thStyle}>Chức vụ</th>
                  <th className={thStyle}>Chi bộ</th>
                  {selectedProcessId === ProcessType.REWARD && (
                      <>
                        <th className={thStyle}>Số QĐ</th>
                        <th className={thStyle}>Cơ quan QĐ</th>
                        <th className={thStyle}>Hình thức</th>
                        <th className={thStyle}>Nội dung</th>
                        <th className={thStyle}>Năm</th>
                      </>
                  )}
                  {selectedProcessId === ProcessType.DISCIPLINE && (
                      <>
                        <th className={thStyle}>Số QĐ</th>
                        <th className={thStyle}>Cơ quan QĐ</th>
                        <th className={thStyle}>Hình thức KL</th>
                        <th className={thStyle}>Nội dung VP</th>
                        <th className={thStyle}>Năm</th>
                      </>
                  )}
                  {selectedProcessId === ProcessType.CONFIRMATION && (
                      <>
                        <th className={thStyle}>Mã ĐV (Được chuẩn y)</th>
                        <th className={thStyle}>Họ tên (Được chuẩn y)</th>
                        <th className={thStyle}>Chức danh chuẩn y</th>
                        <th className={thStyle}>Loại QĐ</th>
                        <th className={thStyle}>Số QĐ</th>
                        <th className={thStyle}>Ngày hiệu lực</th>
                      </>
                  )}
                  {selectedProcessId === ProcessType.ORG_GRADING && (
                      <>
                        <th className={thStyle}>Năm</th>
                        <th className={thStyle}>Tự xếp loại</th>
                        <th className={thStyle}>Kết quả</th>
                      </>
                  )}
                  <th className={thStyle}>Ghi chú</th>
                  <th className={`${thStyle} sticky right-0 bg-gray-50/50 text-right`}>Thao tác</th>
              </tr>
          );
      }

      // Member Grading, Transfer, Abroad (Personal Input)
      // Hide Sender columns in Register Mode (because Sender = Me) ??
      // User requested "Với màn gửi duyệt, phê duyệt đều hiển thị thông tin người gửi cho tôi nhé" for ABROAD.
      if ([ProcessType.MEMBER_GRADING, ProcessType.TRANSFER, ProcessType.ABROAD].includes(selectedProcessId)) {
          const showSender = true; // Always show sender info as requested for Abroad, keeping consistent for others for now or check logic
          // Actually user said: "Với màn gửi duyệt: mà do đảng viên cá nhân gửi lên thì mới không hiện thị thông tin người gửi ra: Xếp loại Đảng viên, Đi nước ngoài, Phiếu thông tin."
          // BUT THEN in the latest prompt: "Với màn gửi duyệt, phê duyệt đều hiển thị thông tin người gửi cho tôi nhé" regarding ABROAD. 
          // This contradicts. I will follow the LATEST instruction for ABROAD to show sender info.
          // For Member Grading, I will keep previous logic (hide in register).
          
          const isAbroad = selectedProcessId === ProcessType.ABROAD;
          const showSenderCols = isAbroad || viewMode === ViewMode.APPROVAL;

          return (
            <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className={cbStyle}><input type="checkbox" className="w-4 h-4 rounded border-gray-300" onClick={(e) => e.stopPropagation()} /></th>
                <th className={thStyle}>Trạng thái</th>
                <th className={thStyle}>Ngày gửi</th>
                {showSenderCols && renderSenderColumns()}
                
                {selectedProcessId === ProcessType.MEMBER_GRADING && (
                    <>
                        <th className={thStyle}>Năm</th>
                        <th className={thStyle}>Tự xếp loại</th>
                        <th className={thStyle}>Đề xuất (C1)</th>
                        <th className={thStyle}>Kết quả (C2)</th>
                    </>
                )}
                
                {selectedProcessId === ProcessType.TRANSFER && (
                    <>
                        <th className={thStyle}>Loại QĐ</th>
                        <th className={thStyle}>Số QĐ</th>
                        <th className={thStyle}>Ngày hiệu lực</th>
                    </>
                )}

                {selectedProcessId === ProcessType.ABROAD && (
                    <>
                        <th className={thStyle}>Loại chuyển đi</th>
                        <th className={thStyle}>Mục đích</th>
                        <th className={thStyle}>Ngày đi</th>
                        <th className={thStyle}>Ngày về</th>
                        <th className={thStyle}>Nơi đến</th>
                        <th className={thStyle}>Kinh phí</th>
                    </>
                )}

                <th className={thStyle}>Ghi chú</th>
                <th className={`${thStyle} sticky right-0 bg-gray-50/50 text-right`}>Thao tác</th>
            </tr>
          );
      }
      
      // Default
      return (
        <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className={cbStyle}><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></th>
            <th className={thStyle}>Trạng thái</th>
            <th className={thStyle}>Mã hồ sơ</th>
            <th className={thStyle}>Ngày gửi</th>
            <th className={thStyle}>Người yêu cầu</th>
            <th className={thStyle}>Lý do</th>
            <th className={thStyle + " w-64 text-right"}>Thao tác</th>
        </tr>
      );
  };

  // --- RENDER TABLE ROW ---
  const renderTableRow = (item: RecordItem) => {
      const tdStyle = "p-4 whitespace-nowrap text-gray-600";
      
      const renderSenderCells = () => (
          <>
            <td className="p-4 whitespace-nowrap font-medium text-blue-600">{item.senderCode}</td>
            <td className="p-4 whitespace-nowrap font-medium text-gray-800">{item.senderName}</td>
            <td className={tdStyle}>{item.senderBranch}</td>
            <td className={tdStyle}>{item.senderRole}</td>
          </>
      );

      const actionButtons = (
        <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
            {viewMode === ViewMode.APPROVAL && (
            (item.status === Status.WAITING || item.status === Status.WAITING_L1 || item.status === Status.WAITING_L2) ? (
                <>
                <button onClick={() => setSelectedRecord(item)} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded hover:bg-green-100 border border-green-200">Xác nhận</button>
                <button onClick={() => setSelectedRecord(item)} className="px-3 py-1.5 bg-white text-red-600 text-xs font-semibold rounded hover:bg-red-50 border border-red-200">Từ chối</button>
                </>
            ) : <span className="text-xs text-gray-400 italic px-2">Đã xử lý</span>
            )}
            {viewMode === ViewMode.REGISTER && (
            (item.status === Status.WAITING || item.status === Status.WAITING_L1 || item.status === Status.WAITING_L2) ? (
                <button onClick={() => handleCancel(item.id)} className="px-3 py-1.5 text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded text-xs font-semibold bg-white">Hủy bỏ</button>
            ) : <span className="text-xs text-gray-400 italic px-2">--</span>
            )}
        </div>
      );

      // Reward, Discipline, Confirmation, Org Grading
      if ([ProcessType.REWARD, ProcessType.DISCIPLINE, ProcessType.ORG_GRADING, ProcessType.CONFIRMATION].includes(selectedProcessId)) {
          return (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors group cursor-pointer text-sm" onClick={() => setSelectedRecord(item)}>
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                <td className={tdStyle}>{item.date}</td>
                {renderSenderCells()}
                {selectedProcessId === ProcessType.REWARD && (
                    <>
                        <td className={tdStyle}>{item.decisionNumber}</td>
                        <td className={tdStyle + " truncate max-w-[150px]"} title={item.decisionAgency}>{item.decisionAgency}</td>
                        <td className={tdStyle}>{item.rewardType}</td>
                        <td className={tdStyle + " truncate max-w-[150px]"} title={item.rewardContent}>{item.rewardContent}</td>
                        <td className={tdStyle}>{item.rewardYear}</td>
                    </>
                )}
                {selectedProcessId === ProcessType.DISCIPLINE && (
                    <>
                        <td className={tdStyle}>{item.decisionNumber}</td>
                        <td className={tdStyle + " truncate max-w-[150px]"} title={item.decisionAgency}>{item.decisionAgency}</td>
                        <td className={tdStyle}>{item.disciplineType}</td>
                        <td className={tdStyle + " truncate max-w-[150px]"} title={item.disciplineContent}>{item.disciplineContent}</td>
                        <td className={tdStyle}>{item.disciplineYear}</td>
                    </>
                )}
                {selectedProcessId === ProcessType.CONFIRMATION && (
                    <>
                        <td className="p-4 whitespace-nowrap font-medium text-blue-600">{item.targetMemberCode}</td>
                        <td className="p-4 whitespace-nowrap font-medium text-gray-800">{item.targetMemberName}</td>
                        <td className="p-4 whitespace-nowrap font-semibold text-blue-700">{item.newPartyTitle}</td>
                        <td className={tdStyle}>{item.confirmationDecisionType}</td>
                        <td className={tdStyle}>{item.newDecisionNumber}</td>
                        <td className={tdStyle}>{item.newEffectiveDate}</td>
                    </>
                )}
                {selectedProcessId === ProcessType.ORG_GRADING && (
                    <>
                        <td className={tdStyle}>{item.gradingYear}</td>
                        <td className="p-4 whitespace-nowrap text-blue-600 font-medium">{item.selfGrading}</td>
                        <td className="p-4 whitespace-nowrap text-green-600 font-bold">{item.finalGrading || '-'}</td>
                    </>
                )}
                <td className={tdStyle + " truncate max-w-[100px]"}>{item.summary}</td>
                <td className="p-4 whitespace-nowrap sticky right-0 bg-white group-hover:bg-gray-50 text-right shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.05)]" onClick={(e) => e.stopPropagation()}>{actionButtons}</td>
            </tr>
          );
      }

      // Member Grading, Transfer, Abroad
      if ([ProcessType.MEMBER_GRADING, ProcessType.TRANSFER, ProcessType.ABROAD].includes(selectedProcessId)) {
        const isAbroad = selectedProcessId === ProcessType.ABROAD;
        const showSenderCols = isAbroad || viewMode === ViewMode.APPROVAL;

        return (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors group cursor-pointer text-sm" onClick={() => setSelectedRecord(item)}>
              <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
              <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
              <td className={tdStyle}>{item.date}</td>
              {showSenderCols && renderSenderCells()}
              
              {selectedProcessId === ProcessType.MEMBER_GRADING && (
                  <>
                    <td className={tdStyle}>{item.gradingYear}</td>
                    <td className="p-4 whitespace-nowrap text-blue-600 font-medium">{item.selfGrading}</td>
                    <td className="p-4 whitespace-nowrap text-orange-600 font-medium">{item.proposedGrading || '-'}</td>
                    <td className="p-4 whitespace-nowrap text-green-600 font-bold">{item.finalGrading || '-'}</td>
                  </>
              )}

              {selectedProcessId === ProcessType.TRANSFER && (
                  <>
                    <td className={tdStyle}>{item.transferDecisionType}</td>
                    <td className={tdStyle}>{item.transferDecisionNumber}</td>
                    <td className={tdStyle}>{item.transferEffectiveDate}</td>
                  </>
              )}

              {selectedProcessId === ProcessType.ABROAD && (
                  <>
                    <td className={tdStyle}>{item.abroadType}</td>
                    <td className={tdStyle}>{item.abroadPurpose}</td>
                    <td className={tdStyle}>{item.abroadDepartDate}</td>
                    <td className={tdStyle}>{item.abroadReturnDate}</td>
                    <td className={tdStyle}>{item.abroadDestination}</td>
                    <td className={tdStyle}>{item.abroadBudget}</td>
                  </>
              )}

              <td className={tdStyle + " truncate max-w-[100px]"}>{selectedProcessId === ProcessType.ABROAD ? item.abroadNote : item.summary}</td>
              <td className="p-4 whitespace-nowrap sticky right-0 bg-white group-hover:bg-gray-50 text-right shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.05)]" onClick={(e) => e.stopPropagation()}>{actionButtons}</td>
          </tr>
        );
      }

      // Default
      return (
        <tr key={item.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedRecord(item)}>
            <td className="p-5 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
            <td className="p-5"><StatusBadge status={item.status} /></td>
            <td className="p-5 text-sm text-gray-500">{item.id}</td>
            <td className="p-5 text-sm text-gray-600">{item.date}</td>
            <td className="p-5 text-sm font-semibold text-gray-800">{item.applicant}</td>
            <td className="p-5 text-sm text-gray-600 max-w-xs truncate">{item.summary}</td>
            <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>{actionButtons}</td>
        </tr>
      );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col text-[#333]">
      <Header 
        title="Cổng thông tin Đảng viên" 
        currentView={viewMode}
        onChangeView={(mode) => {
            setViewMode(mode);
            setSelectedStatusTab('TOTAL');
            setCurrentPage(1);
            setSelectedRecord(null);
        }}
      />
      
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-6">
        <div className="mb-6 flex justify-between items-center h-10">
           <h2 className="text-2xl font-bold text-gray-800">
             {viewMode === ViewMode.REGISTER ? "Đăng ký yêu cầu" : "Phê duyệt hồ sơ"}
           </h2>
           {viewMode === ViewMode.REGISTER && (
              <button 
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md shadow-blue-200 transition-all active:scale-95"
              >
                <Plus size={18} className="mr-2" />
                Tạo mới yêu cầu
              </button>
           )}
        </div>

        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100">
            {PROCESS_LIST.map(process => (
              <button
                key={process.id}
                onClick={() => {
                  setSelectedProcessId(process.id);
                  setSelectedStatusTab('TOTAL');
                  setCurrentPage(1);
                }}
                className={`
                  px-6 py-5 whitespace-nowrap text-sm font-medium transition-all relative
                  ${selectedProcessId === process.id 
                    ? 'text-blue-600 bg-blue-50/30' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {process.label}
                {selectedProcessId === process.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 bg-white flex flex-wrap gap-3 items-center border-b border-gray-100">
              {statusTabs.map(tab => (
                <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatusTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2
                  ${getTabStyles(tab.id, selectedStatusTab === tab.id)}
                `}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${getTabCountStyles(tab.id, selectedStatusTab === tab.id)}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-sm min-h-[500px] flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {renderTableHeader()}
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => renderTableRow(item))
                ) : (
                  <tr>
                    <td colSpan={14} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Ban size={64} className="mb-4 opacity-20" />
                          <p className="text-base font-medium">Không có dữ liệu cho trạng thái này</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
           <div className="mt-auto p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 rounded-b-xl">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Hiển thị</span>
                <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 shadow-sm">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-500">/ Tổng {filteredData.length} dòng</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
          </div>
        </div>
      </main>

      {/* Modals Rendering */}
      {((selectedRecord && selectedRecord.type === ProcessType.REWARD) || (isCreateModalOpen && selectedProcessId === ProcessType.REWARD)) && (
          <RewardModal 
            record={selectedRecord || undefined} 
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.DISCIPLINE) || (isCreateModalOpen && selectedProcessId === ProcessType.DISCIPLINE)) && (
          <DisciplineModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.MEMBER_GRADING) || (isCreateModalOpen && selectedProcessId === ProcessType.MEMBER_GRADING)) && (
          <GradingModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.ORG_GRADING) || (isCreateModalOpen && selectedProcessId === ProcessType.ORG_GRADING)) && (
          <OrgGradingModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.CONFIRMATION) || (isCreateModalOpen && selectedProcessId === ProcessType.CONFIRMATION)) && (
          <ConfirmationModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.TRANSFER) || (isCreateModalOpen && selectedProcessId === ProcessType.TRANSFER)) && (
          <TransferModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {((selectedRecord && selectedRecord.type === ProcessType.ABROAD) || (isCreateModalOpen && selectedProcessId === ProcessType.ABROAD)) && (
          <AbroadModal 
            record={selectedRecord || undefined}
            viewMode={viewMode}
            onClose={() => { setSelectedRecord(null); setIsCreateModalOpen(false); }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
      {selectedRecord && !([ProcessType.REWARD, ProcessType.DISCIPLINE, ProcessType.MEMBER_GRADING, ProcessType.ORG_GRADING, ProcessType.CONFIRMATION, ProcessType.TRANSFER, ProcessType.ABROAD] as ProcessType[]).includes(selectedRecord.type) && (
          <DetailModal 
            record={selectedRecord}
            viewMode={viewMode}
            onClose={() => setSelectedRecord(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
    </div>
  );
};

export default App;