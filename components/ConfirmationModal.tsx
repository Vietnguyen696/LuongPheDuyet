import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Search, Calendar, Upload, User, Briefcase, MessageSquare } from 'lucide-react';
import { RecordItem, Status, ViewMode, PartyMember, ApprovalInfo } from '../types';
import { CONFIRMATION_TYPES, PARTY_TITLES } from '../constants';

interface ConfirmationModalProps {
  record?: RecordItem;
  viewMode: ViewMode;
  onClose: () => void;
  onApprove?: (id: string, comment: string) => void;
  onReject?: (id: string, comment: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  record, 
  viewMode, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  
  const isCreate = !record || !record.id;
  const canAct = !isCreate && viewMode === ViewMode.APPROVAL && record?.status === Status.WAITING;

  // Form State
  const [formData, setFormData] = useState({
      decisionType: record?.confirmationDecisionType || CONFIRMATION_TYPES[0],
      newTitle: record?.newPartyTitle || PARTY_TITLES[0],
      newDecisionNum: record?.newDecisionNumber || '',
      newEffectiveDate: record?.newEffectiveDate || '',
      note: record?.confirmationNote || ''
  });

  const inputClass = "w-full bg-[#FFF9E6] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors placeholder-gray-400";
  const readOnlyClass = "w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none text-gray-600 cursor-not-allowed";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  // Approval History Component
  const ApprovalHistoryItem = ({ title, info }: { title: string, info?: ApprovalInfo }) => {
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
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><Calendar size={12} className="mr-1"/> Ngày duyệt</div>
             <div className="font-medium text-gray-800">{info.actionDate}</div>
          </div>
          <div className="col-span-2 mt-1">
             <div className="text-xs text-gray-500 mb-1 flex items-center"><MessageSquare size={12} className="mr-1"/> Lý do / Ý kiến</div>
             <div className="bg-white p-2 rounded border border-gray-200 text-gray-700 italic text-sm">"{info.comment}"</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
             {isCreate ? "Tạo mới Chuẩn y" : "Chi tiết Công tác Chuẩn y"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* I. Member Info */}
          <section className="mb-6">
            <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                I. Thông tin Đảng viên
            </h4>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Mã Đảng viên <span className="text-red-500">*</span></label>
                    {isCreate ? (
                        <div className="flex items-center relative">
                            <input type="text" className={inputClass} placeholder="Chọn đảng viên..." />
                            <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                    ) : (
                        <input type="text" className={readOnlyClass} value={record?.targetMemberCode} disabled />
                    )}
                </div>
                <div>
                    <label className={labelClass}>Họ và tên</label>
                    <input type="text" className={readOnlyClass} value={record?.targetMemberName || (isCreate ? "" : "Nguyễn Văn A")} disabled />
                </div>
            </div>
          </section>

          {/* II. Current Info (Read Only) */}
          <section className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 border-l-4 border-gray-400 pl-3 mb-4 uppercase">
                II. Thông tin hiện tại
            </h4>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Loại quyết định</label>
                    <input type="text" className={readOnlyClass} value="Kiện toàn cấp ủy (Cũ)" disabled />
                </div>
                <div>
                    <label className={labelClass}>Chi bộ Đảng</label>
                    <input type="text" className={readOnlyClass} value={record?.targetMemberBranch || "Chi bộ 1"} disabled />
                </div>
                <div>
                    <label className={labelClass}>Đảng bộ trực thuộc</label>
                    <input type="text" className={readOnlyClass} value="Đảng bộ Khối Doanh nghiệp" disabled />
                </div>
                <div>
                    <label className={labelClass}>Chức danh Đảng</label>
                    <input type="text" className={readOnlyClass} value={record?.currentPartyTitle || "Đảng viên"} disabled />
                </div>
                <div>
                    <label className={labelClass}>Số quyết định</label>
                    <input type="text" className={readOnlyClass} value={record?.currentDecisionNumber || "10/QĐ-CU"} disabled />
                </div>
                <div>
                    <label className={labelClass}>Ngày hiệu lực</label>
                    <input type="text" className={readOnlyClass} value={record?.currentEffectiveDate || "01/01/2024"} disabled />
                </div>
            </div>
          </section>

          {/* III. New Decision Info (Input) */}
          <section className="mb-6">
            <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                III. Thông tin quyết định
            </h4>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Loại quyết định <span className="text-red-500">*</span></label>
                    <select 
                        className={isCreate ? inputClass : readOnlyClass} 
                        value={formData.decisionType}
                        disabled={!isCreate}
                        onChange={(e) => setFormData({...formData, decisionType: e.target.value})}
                    >
                        {CONFIRMATION_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Chi bộ Đảng</label>
                    <input type="text" className={readOnlyClass} value={record?.targetMemberBranch || "Chi bộ 1"} disabled />
                </div>
                <div>
                    <label className={labelClass}>Đảng bộ trực thuộc</label>
                    <input type="text" className={readOnlyClass} value="Đảng bộ Khối Doanh nghiệp" disabled />
                </div>
                <div>
                    <label className={labelClass}>Chức danh Đảng (Được chuẩn y) <span className="text-red-500">*</span></label>
                    <select 
                        className={isCreate ? inputClass : readOnlyClass} 
                        value={formData.newTitle}
                        disabled={!isCreate}
                        onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
                    >
                        {PARTY_TITLES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Số quyết định <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        className={isCreate ? inputClass : readOnlyClass} 
                        value={formData.newDecisionNum} 
                        placeholder="VD: 538-QĐ/ĐUVP"
                        readOnly={!isCreate}
                        onChange={(e) => setFormData({...formData, newDecisionNum: e.target.value})}
                    />
                </div>
                <div>
                    <label className={labelClass}>Ngày hiệu lực <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            type="text" 
                            className={isCreate ? inputClass : readOnlyClass} 
                            value={formData.newEffectiveDate} 
                            placeholder="dd/mm/yyyy"
                            readOnly={!isCreate}
                            onChange={(e) => setFormData({...formData, newEffectiveDate: e.target.value})}
                        />
                        <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="col-span-2">
                    <label className={labelClass}>Ghi chú</label>
                    <input 
                        type="text" 
                        className={isCreate ? inputClass : readOnlyClass} 
                        value={formData.note} 
                        readOnly={!isCreate}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                    />
                </div>
                <div className="col-span-2">
                    <label className={labelClass}>File đính kèm</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <span className="font-medium text-blue-600 hover:text-blue-500">Tải lên tệp</span>
                                <p className="pl-1">hoặc kéo thả vào đây</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Approval Action Section (Only visible when approving) */}
          {canAct && (
             <section className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                 <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                    Thông tin xử lý
                 </h4>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ý kiến / Lý do <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white shadow-sm"
                        rows={3}
                        placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
             </section>
          )}

          {/* Approval History */}
          {record?.level1Result && (
             <section className="mt-8 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase">
                    Lịch sử phê duyệt
                </h4>
                <ApprovalHistoryItem title="Đảng ủy phê duyệt" info={record?.level1Result} />
             </section>
          )}

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
                    Lưu
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
                        onClick={() => onApprove(record!.id, comment)}
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