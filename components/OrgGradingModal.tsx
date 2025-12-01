import React, { useState } from 'react';
import { X, CheckCircle, XCircle, User, Briefcase, MessageSquare, Award, Building2 } from 'lucide-react';
import { RecordItem, Status, ViewMode, ApprovalInfo } from '../types';
import { ORG_GRADING_OPTIONS } from '../constants';

interface OrgGradingModalProps {
  record?: RecordItem;
  viewMode: ViewMode;
  onClose: () => void;
  onApprove?: (id: string, comment: string, data?: any) => void;
  onReject?: (id: string, comment: string) => void;
}

export const OrgGradingModal: React.FC<OrgGradingModalProps> = ({ 
  record, 
  viewMode, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  const [approvalGrade, setApprovalGrade] = useState(''); 

  const isCreate = !record || !record.id;
  
  // 1-Level Approval Logic: Actionable if status is WAITING in Approval Mode
  const canAct = !isCreate && viewMode === ViewMode.APPROVAL && record?.status === Status.WAITING;

  // Form State
  const [formData, setFormData] = useState({
      gradingYear: record?.gradingYear || new Date().getFullYear().toString(),
      selfGrading: record?.selfGrading || ORG_GRADING_OPTIONS[1],
      gradingNote: record?.gradingNote || ''
  });

  const inputClass = "w-full bg-[#FFF9E6] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors placeholder-gray-400";
  const readOnlyClass = "w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none text-gray-700";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  // Approval History Component
  const ApprovalHistoryItem = ({ title, info, grade }: { title: string, info?: ApprovalInfo, grade?: string }) => {
    if (!info) return null;
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b border-gray-200 pb-1 flex justify-between items-center">
            {title}
            {info.result === 'APPROVED' ? (
                <span className="text-green-600 text-xs flex items-center font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><CheckCircle size={12} className="mr-1"/> Đồng ý</span>
            ) : (
                <span className="text-red-600 text-xs flex items-center font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><XCircle size={12} className="mr-1"/> Từ chối</span>
            )}
        </h4>
        <div className="grid grid-cols-2 gap-y-3 text-sm mt-3">
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><User size={12} className="mr-1"/> Người duyệt</div>
             <div className="font-medium text-gray-800">{info.approverName}</div>
          </div>
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><Briefcase size={12} className="mr-1"/> Chức vụ</div>
             <div className="font-medium text-gray-800">{info.approverRole}</div>
          </div>
          {grade && (
              <div className="col-span-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                 <div className="text-xs text-gray-500 mb-0.5 flex items-center"><Award size={12} className="mr-1"/> Kết quả xếp loại</div>
                 <div className="font-bold text-blue-700">{grade}</div>
              </div>
          )}
          <div className="col-span-2 mt-1">
             <div className="text-xs text-gray-500 mb-1 flex items-center"><MessageSquare size={12} className="mr-1"/> Lý do / Ý kiến</div>
             <div className="bg-white p-2 rounded border border-gray-200 text-gray-700 italic text-sm">"{info.comment}"</div>
          </div>
        </div>
      </div>
    );
  };

  const handleConfirm = () => {
      if (canAct && onApprove) {
          if (!approvalGrade) {
              alert("Vui lòng nhập kết quả xếp loại");
              return;
          }
          // For 1-level approval, directly set finalGrading
          onApprove(record!.id, comment, { finalGrading: approvalGrade });
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
             {isCreate ? "Đăng ký Xếp loại Tổ chức Đảng" : "Chi tiết Xếp loại Tổ chức Đảng"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             {/* Left Column: Organization Info */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                    Thông tin Tổ chức
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className={labelClass}>Tên tổ chức / Chi bộ</label>
                        <div className="flex items-center">
                            <Building2 size={16} className="text-gray-400 mr-2" />
                            <input type="text" className={readOnlyClass} value={record?.applicant || "Chi bộ 1"} disabled />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                        Đăng ký xếp loại
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Năm xếp loại</label>
                            <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.gradingYear} readOnly={!isCreate} />
                        </div>
                        <div>
                            <label className={labelClass}>Tự xếp loại <span className="text-red-500">*</span></label>
                            {isCreate ? (
                                <select className={inputClass} value={formData.selfGrading} onChange={(e) => setFormData({...formData, selfGrading: e.target.value})}>
                                    {ORG_GRADING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 text-blue-700 font-bold px-3 py-2 rounded text-sm">
                                    {formData.selfGrading}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className={labelClass}>Ghi chú / Minh chứng</label>
                            <textarea className={isCreate ? inputClass : readOnlyClass} rows={3} value={formData.gradingNote} readOnly={!isCreate}></textarea>
                        </div>
                    </div>
                </div>
             </div>

             {/* Right Column: Approval Actions & History */}
             <div className="space-y-6">
                
                {/* Approval Input Section */}
                {canAct && (
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
                        <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center">
                            <Briefcase size={16} className="mr-2"/>
                            Phê duyệt xếp loại
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kết quả xếp loại <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="w-full border border-blue-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-800"
                                    value={approvalGrade}
                                    onChange={(e) => setApprovalGrade(e.target.value)}
                                >
                                    <option value="">-- Chọn kết quả --</option>
                                    {ORG_GRADING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ý kiến / Nhận xét
                                </label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    rows={3}
                                    placeholder="Nhập ý kiến..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* History Section */}
                {record?.level1Result && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase mt-2">
                            Kết quả phê duyệt
                        </h4>
                        <ApprovalHistoryItem title="Đảng ủy phê duyệt" info={record?.level1Result} grade={record?.finalGrading} />
                    </div>
                )}
                
                {!canAct && !record?.level1Result && !isCreate && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-400 italic">
                        Chưa có thông tin phê duyệt
                    </div>
                )}
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded shadow-sm text-sm font-medium hover:bg-gray-100 transition-colors"
            >
                {isCreate ? "Hủy" : "Đóng"}
            </button>
            
            {isCreate && (
                <button className="px-6 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors">
                    Gửi yêu cầu
                </button>
            )}

            {canAct && onReject && onApprove && (
                <>
                    <button 
                        onClick={() => onReject(record!.id, comment)}
                        className="px-6 py-2 bg-white border border-red-300 text-red-600 rounded shadow-sm text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        Từ chối
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-green-600 text-white rounded shadow-sm text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        Xác nhận
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  );
};