import React, { useState } from 'react';
import { X, CheckCircle, XCircle, User, Briefcase, MessageSquare, Calendar, Plane, MapPin, DollarSign, FileText } from 'lucide-react';
import { RecordItem, Status, ViewMode, ApprovalInfo } from '../types';

interface AbroadModalProps {
  record?: RecordItem;
  viewMode: ViewMode;
  onClose: () => void;
  onApprove?: (id: string, comment: string) => void;
  onReject?: (id: string, comment: string) => void;
}

export const AbroadModal: React.FC<AbroadModalProps> = ({ 
  record, 
  viewMode, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  
  const isCreate = !record || !record.id;
  
  // 2-Level Approval
  const isLevel1Approval = viewMode === ViewMode.APPROVAL && (record?.status === Status.WAITING || record?.status === Status.WAITING_L1);
  const isLevel2Approval = viewMode === ViewMode.APPROVAL && record?.status === Status.WAITING_L2;
  const canAct = !isCreate && (isLevel1Approval || isLevel2Approval);

  // Form State
  const [formData, setFormData] = useState({
      abroadType: record?.abroadType || 'Việc riêng',
      purpose: record?.abroadPurpose || '',
      departDate: record?.abroadDepartDate || '',
      returnDate: record?.abroadReturnDate || '',
      destination: record?.abroadDestination || '',
      budget: record?.abroadBudget || '',
      note: record?.abroadNote || ''
  });

  const inputClass = "w-full bg-[#FFF9E6] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors placeholder-gray-400";
  const readOnlyClass = "w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none text-gray-700";
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
             {isCreate ? "Đăng ký Đi nước ngoài" : "Chi tiết Đi nước ngoài"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             {/* Left Column: Personal Info (Sender) */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                    Thông tin Đảng viên
                </h4>
                
                <div className="space-y-3">
                    <div>
                        <label className={labelClass}>Họ và tên</label>
                        <input type="text" className={readOnlyClass} value={record?.senderName || "Nguyễn Văn A"} disabled />
                    </div>
                    <div>
                        <label className={labelClass}>Mã Đảng viên</label>
                        <input type="text" className={readOnlyClass} value={record?.senderCode || "DV-XXXX (Tôi)"} disabled />
                    </div>
                    <div>
                        <label className={labelClass}>Chi bộ</label>
                        <input type="text" className={readOnlyClass} value={record?.senderBranch || "Chi bộ 1"} disabled />
                    </div>
                    <div>
                        <label className={labelClass}>Chức danh</label>
                        <input type="text" className={readOnlyClass} value={record?.senderRole || "Đảng viên"} disabled />
                    </div>
                </div>
             </div>

             {/* Right Column: Trip Info */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                    Thông tin chuyến đi
                </h4>
                
                <div className="space-y-3">
                    <div>
                        <label className={labelClass}>Loại chuyển đi</label>
                        <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.abroadType} readOnly={!isCreate} />
                    </div>
                    <div>
                        <label className={labelClass}>Mục đích chuyển đi <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className={isCreate ? inputClass : readOnlyClass} 
                            value={formData.purpose} 
                            readOnly={!isCreate}
                            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Ngày đi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.departDate} readOnly={!isCreate} placeholder="dd/mm/yyyy" onChange={(e) => setFormData({...formData, departDate: e.target.value})}/>
                                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Ngày về <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.returnDate} readOnly={!isCreate} placeholder="dd/mm/yyyy" onChange={(e) => setFormData({...formData, returnDate: e.target.value})}/>
                                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Nơi đến <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.destination} readOnly={!isCreate} onChange={(e) => setFormData({...formData, destination: e.target.value})}/>
                            <MapPin className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Kinh phí</label>
                        <div className="relative">
                            <input type="text" className={isCreate ? inputClass : readOnlyClass} value={formData.budget} readOnly={!isCreate} onChange={(e) => setFormData({...formData, budget: e.target.value})}/>
                            <DollarSign className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Ghi chú</label>
                        <textarea className={isCreate ? inputClass : readOnlyClass} rows={2} value={formData.note} readOnly={!isCreate} onChange={(e) => setFormData({...formData, note: e.target.value})}></textarea>
                    </div>
                </div>
             </div>
          </div>

          {/* Approval Section */}
          <div className="space-y-6 mt-6">
             {canAct && (
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
                    <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center">
                        <Briefcase size={16} className="mr-2"/>
                        Thông tin xử lý {isLevel1Approval ? "(Cấp 1: Bí thư chi bộ)" : "(Cấp 2: Thường trực Đảng ủy)"}
                    </h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ý kiến / Nhận xét <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            className="w-full border border-blue-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            rows={3}
                            placeholder="Nhập ý kiến..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>
             )}

             {(record?.level1Result || record?.level2Result) && (
                <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase pt-4 border-t border-gray-100">
                        Lịch sử phê duyệt
                    </h4>
                    <ApprovalHistoryItem title="Phê duyệt Cấp 1" info={record?.level1Result} />
                    <ApprovalHistoryItem title="Phê duyệt Cấp 2" info={record?.level2Result} />
                </div>
             )}
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