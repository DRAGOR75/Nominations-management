'use client';

import { useState, useRef } from 'react';
import { addTrainer, deleteTrainer } from '@/app/actions/trainers';
import {
    UserPlus,
    Mail,
    Phone,
    Trash2,
    Users,
    ChevronDown,
    ChevronUp,
    Plus
} from 'lucide-react';

type Trainer = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
};

export default function TrainerManager({ trainers }: { trainers: Trainer[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleAddTrainer(formData: FormData) {
        setLoading(true);
        const result = await addTrainer(formData);
        setLoading(false);

        if (result?.error) {
            alert(result.error);
        } else {
            formRef.current?.reset();
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header / Toggle */}
            <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Trainer Directory</h3>
                        <p className="text-xs text-slate-500">{trainers.length} Registered Trainers</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-blue-600 text-sm font-semibold flex items-center gap-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-5 pt-0 space-y-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">

                    {/* Professional Add Form */}
                    <form ref={formRef} action={handleAddTrainer} className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-5 text-slate-700">
                            <UserPlus size={16} />
                            <span className="text-sm font-bold">Register New Trainer</span>
                        </div>

                        <div className="space-y-4">
                            {/* Row 1: Name and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name</label>
                                    <input name="name" required placeholder="John Doe" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <input name="email" type="email" required placeholder="john@thriveni.com" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                            </div>

                            {/* Row 2: Mobile Number and Button */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mobile Number</label>
                                    <input name="phone" required placeholder="+91 ..." className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <button
                                        disabled={loading}
                                        className="w-full md:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm active:transform active:scale-95"
                                    >
                                        <Plus size={18} />
                                        {loading ? 'Processing...' : 'Add Trainer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Trainer List */}
                    <div className="flex flex-col gap-2">
                        {trainers.map((t) => (
                            <div key={t.id} className="group p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white flex items-center justify-between gap-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
                                    <div className="flex items-center gap-3 min-w-[200px]">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{t.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-blue-400" />
                                            <span>{t.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-emerald-400" />
                                            <span>{t.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { if (confirm('Delete this trainer?')) deleteTrainer(t.id) }}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Trainer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {trainers.length === 0 && (
                            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="text-slate-400 text-sm">No trainers found in the system.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}