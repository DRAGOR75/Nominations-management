import { db } from '@/lib/prisma';
import { updateNominationStatus } from '@/app/actions/tni';
import { Check, X, ShieldAlert } from 'lucide-react';
import { notFound } from 'next/navigation';

// Server Component for Manager Approval
export default async function ManagerApprovalPage({ params }: { params: { empId: string } }) {
    const { empId } = params;

    // Fetch pending nominations for this employee
    const employee = await db.employee.findUnique({
        where: { id: empId },
        include: {
            nominations: {
                where: { status: 'Pending' },
                include: { program: true }
            }
        }
    });

    if (!employee) {
        return notFound();
    }

    const nominations = employee.nominations;
    const justification = nominations.length > 0 ? nominations[0].justification : '';

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Nomination Approval</h1>
                    <p className="text-slate-500">Review training requests for <strong className="text-slate-800">{employee.name}</strong> ({employee.id})</p>

                    {justification && (
                        <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Employee Justification</h3>
                            <p className="text-slate-600 italic">"{justification}"</p>
                        </div>
                    )}
                </div>

                {/* Nominations List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 px-1">Pending Requests ({nominations.length})</h2>

                    {nominations.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                            <ShieldAlert className="mx-auto text-slate-300 mb-3" size={48} />
                            <p className="text-slate-500 font-medium">No pending nominations found for this employee.</p>
                        </div>
                    ) : (
                        nominations.map((nomination) => (
                            <div key={nomination.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{nomination.program.name}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                        {nomination.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <form action={async () => {
                                        'use server';
                                        await updateNominationStatus(nomination.id, 'Rejected');
                                    }}>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-medium transition-colors"
                                        >
                                            <X size={18} />
                                            Reject
                                        </button>
                                    </form>

                                    <form action={async () => {
                                        'use server';
                                        await updateNominationStatus(nomination.id, 'Approved');
                                    }}>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors shadow-lg shadow-green-600/20"
                                        >
                                            <Check size={18} />
                                            Approve
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
