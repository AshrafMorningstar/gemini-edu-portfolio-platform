
import React, { useState, useEffect } from 'react';
import { User, UserRole, Activity } from '../types';
import { db } from '../services/db';
import ActivityModal from '../components/ActivityModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { extractPdfContent, getPortfolioAdvice } from '../services/gemini';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    if (user.role === UserRole.ADMIN) {
      setTeachers(db.getUsers().filter(u => u.role === UserRole.TEACHER));
      setActivities(db.getActivities());
    } else {
      const myActs = db.getActivities().filter(a => a.teacherId === user.id);
      setActivities(myActs);
      fetchAiInsights(myActs);
    }
  };

  const fetchAiInsights = async (acts: Activity[]) => {
    if (acts.length > 0) {
      const advice = await getPortfolioAdvice(acts);
      setAiInsights(advice);
    }
  };

  const handleSaveActivity = async (data: Partial<Activity>) => {
    setIsLoading(true);
    let extractedText = "";
    if (data.fileData && data.fileName) {
      extractedText = await extractPdfContent(data.fileData, data.fileName);
    }

    if (editingActivity) {
      const updated: Activity = {
        ...editingActivity,
        ...data,
        extractedContent: extractedText || editingActivity.extractedContent,
      } as Activity;
      db.updateActivity(updated);
    } else {
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        teacherId: user.id,
        createdAt: Date.now(),
        extractedContent: extractedText,
        ...data,
      } as Activity;
      db.saveActivity(newActivity);
    }
    setIsLoading(false);
    setIsModalOpen(false);
    setEditingActivity(undefined);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this activity?")) {
      db.deleteActivity(id);
      refreshData();
    }
  };

  const chartData = [
    { name: 'Practices', count: activities.filter(a => a.type === 'PRACTICE').length },
    { name: 'Seminars', count: activities.filter(a => a.type === 'SEMINAR').length },
  ];

  const filteredActivities = user.role === UserRole.ADMIN && selectedTeacherId 
    ? activities.filter(a => a.teacherId === selectedTeacherId)
    : activities;

  return (
    <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">
            {user.role === UserRole.ADMIN ? 'Admin Center' : 'Teacher Portal'}
          </h1>
          <p className="text-gray-500 mt-2">Manage professional certifications and practice history.</p>
        </div>
        {user.role === UserRole.TEACHER && (
          <button 
            onClick={() => { setEditingActivity(undefined); setIsModalOpen(true); }}
            className="px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-all uppercase shadow-[6px_6px_0px_#444] active:translate-y-1 active:shadow-[2px_2px_0px_#444]"
          >
            Add Activity
          </button>
        )}
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 h-[300px]">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-6">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#fff' : '#888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4">AI Portfolio Insights</h3>
            {user.role === UserRole.TEACHER ? (
              <div className="text-sm text-gray-300 italic leading-relaxed">
                {aiInsights || "Add some activities to get AI-powered portfolio growth suggestions."}
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                You are managing <span className="text-white font-bold">{teachers.length}</span> active teacher portfolios.
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
              <span>System Status</span>
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Synchronized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar for Admin */}
        {user.role === UserRole.ADMIN && (
          <div className="xl:col-span-1 space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400 px-2">Teacher Accounts</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedTeacherId(null)}
                className={`w-full text-left p-3 text-sm transition-all ${!selectedTeacherId ? 'bg-white text-black font-bold' : 'hover:bg-white/5'}`}
              >
                All Submissions
              </button>
              {teachers.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`w-full text-left p-3 text-sm transition-all border-l-2 ${selectedTeacherId === t.id ? 'border-white bg-white/10' : 'border-transparent hover:bg-white/5'}`}
                >
                  <p className="font-medium">{t.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{t.email}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className={user.role === UserRole.ADMIN ? 'xl:col-span-3' : 'xl:col-span-4'}>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-gray-800">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Type</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Title</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Date Range</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-500 text-sm italic">
                        No activities found.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map(act => (
                      <tr key={act.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter ${act.type === 'PRACTICE' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            {act.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-sm">{act.title}</p>
                          {user.role === UserRole.ADMIN && (
                            <p className="text-[10px] text-gray-500 uppercase">by {teachers.find(t => t.id === act.teacherId)?.name}</p>
                          )}
                        </td>
                        <td className="p-4 text-xs text-gray-400">
                          {act.fromDate} → {act.toDate}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button 
                            onClick={() => setViewingActivity(act)}
                            className="text-gray-400 hover:text-white text-xs uppercase font-bold"
                          >
                            View
                          </button>
                          {user.role === UserRole.TEACHER && (
                            <>
                              <button 
                                onClick={() => { setEditingActivity(act); setIsModalOpen(true); }}
                                className="text-gray-400 hover:text-white text-xs uppercase font-bold"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(act.id)}
                                className="text-gray-400 hover:text-red-500 text-xs uppercase font-bold"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Viewer Modal */}
      {viewingActivity && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
          <div className="glass-card w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-widest">{viewingActivity.type}</span>
                <h2 className="text-3xl font-black uppercase mt-1">{viewingActivity.title}</h2>
              </div>
              <button onClick={() => setViewingActivity(null)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-800">
              <div>
                <p className="text-[10px] uppercase text-gray-500">Duration</p>
                <p className="text-sm">{viewingActivity.fromDate} to {viewingActivity.toDate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-500">Document Proof</p>
                <p className="text-sm">{viewingActivity.fileName || 'No file attached'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed">{viewingActivity.description || "No description provided."}</p>
            </div>

            {viewingActivity.extractedContent && (
              <div className="bg-white/5 p-6 border-l-2 border-white">
                <p className="text-[10px] uppercase text-white font-bold mb-4 tracking-widest">AI Extracted Content from PDF</p>
                <div className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {viewingActivity.extractedContent}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setViewingActivity(null)}
                className="px-8 py-2 bg-white text-black font-bold uppercase text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Analyzing document with Gemini AI...</p>
        </div>
      )}

      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingActivity(undefined); }} 
        onSave={handleSaveActivity}
        initialData={editingActivity}
      />
    </div>
  );
};

export default Dashboard;
