
import React from 'react';
import { AppTab } from '../types';
import { 
    Terminal, 
    BookOpen, 
    Github, 
    Cpu, 
    Layers, 
    Search,
    ChevronRight,
    MessageSquare
} from 'lucide-react';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const menuItems = [
    { id: AppTab.SETUP, label: 'Setup Guide', icon: <Terminal size={20} /> },
    { id: AppTab.SOURCES, label: 'Package Sources', icon: <Layers size={20} /> },
    { id: AppTab.ACTIONS, label: 'GitHub Actions', icon: <Github size={20} /> },
    { id: AppTab.AI_ASSISTANT, label: 'Dev AI Assistant', icon: <MessageSquare size={20} /> },
    { id: AppTab.RESOURCES, label: 'Resources', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 sticky top-0 md:h-screen z-20">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Cpu size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            TermuxDev
          </h1>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto">
                  <ChevronRight size={14} className="text-indigo-500" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-800 hidden md:block">
            <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-slate-500">
                <p>Status: Local Engine Online</p>
                <p className="mt-1">Version: 1.0.4-Stable</p>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
