
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CodeBlock from './components/CodeBlock';
import { AppTab } from './types';
import { SETUP_STEPS, PACKAGE_SOURCES, ACTION_TEMPLATES } from './constants';
import { getTermuxAdvice, generateCustomWorkflow } from './services/geminiService';
import { Send, Zap, Shield, HelpCircle, ExternalLink, RefreshCw, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SETUP);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(ACTION_TEMPLATES[0]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    const result = await getTermuxAdvice(aiInput);
    setAiResponse(result);
    setIsAiLoading(false);
  };

  const renderSetup = () => (
    <div className="space-y-8">
      <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-600/20">
          <Zap size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Interactive Setup Guide</h2>
          <p className="text-slate-400">Follow these steps to prepare your Termux environment for Java and Gradle development.</p>
        </div>
      </div>

      <div className="space-y-6 relative">
        <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-800 hidden md:block"></div>
        {SETUP_STEPS.map((step, idx) => (
          <div key={step.id} className="relative md:pl-16 group">
            <div className="absolute left-4 -translate-x-1/2 top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-indigo-500 transition-colors hidden md:block"></div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">STEP {idx + 1}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>
              <CodeBlock code={step.command} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSources = () => (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Package Sources</h2>
        <p className="text-slate-400">Configure your `.list` files for optimal package resolution.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PACKAGE_SOURCES.map((source) => (
          <div key={source.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-indigo-400">{source.name}</h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${source.type === 'official' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {source.type}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{source.description}</p>
            <div className="text-xs font-mono text-slate-500 bg-slate-950 p-2 rounded break-all border border-slate-800/50">
              {source.url}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="text-indigo-500" />
          <h3 className="text-xl font-bold">Fix Common Repo Errors</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">If you encounter 404 errors or connection issues, use the official tool to select a mirror:</p>
        <CodeBlock code="termux-change-repo" />
        <div className="mt-6 flex items-start gap-3 bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/10">
          <HelpCircle size={18} className="text-indigo-400 mt-0.5" />
          <p className="text-xs text-indigo-300 leading-relaxed">
            Select "Main Repository" -> "Albatross (Cloudflare/Google)" for best global performance on stable networks.
          </p>
        </div>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">GitHub Actions</h2>
        <p className="text-slate-400">Automate your builds with pre-configured YAML workflows.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {ACTION_TEMPLATES.map((tpl) => (
          <button
            key={tpl.name}
            onClick={() => setActiveWorkflow(tpl)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeWorkflow.name === tpl.name 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold mb-1">{activeWorkflow.name}</h3>
          <p className="text-sm text-slate-400">{activeWorkflow.description}</p>
        </div>
        <div className="p-2">
            <CodeBlock code={activeWorkflow.content} language="yaml" title=".github/workflows/build.yml" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-900/20 border border-indigo-500/20 rounded-2xl p-8 mt-12 text-center">
        <h3 className="text-xl font-bold mb-3">Need a Custom Workflow?</h3>
        <p className="text-slate-400 mb-6 text-sm max-w-lg mx-auto">
          Describe your project architecture (e.g., Kotlin, Docker, specific JDK) in the Dev AI Assistant tab to generate a custom configuration.
        </p>
        <button 
          onClick={() => setActiveTab(AppTab.AI_ASSISTANT)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/20"
        >
          Generate with AI <Zap size={18} />
        </button>
      </div>
    </div>
  );

  const renderAi = () => (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Termux Dev AI</h2>
        <p className="text-slate-400">Ask troubleshooting questions or request custom code snippets for your environment.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
        <div className="flex-1 space-y-4 mb-6">
          {!aiResponse && !isAiLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                Ask me something like "How do I fix Gradle 404 in Termux?" or "Generate a basic Java class for testing."
              </p>
            </div>
          )}

          {isAiLoading && (
            <div className="flex items-center gap-3 text-indigo-400 animate-pulse">
              <RefreshCw className="animate-spin" size={20} />
              <span className="text-sm font-medium">Gemini is thinking...</span>
            </div>
          )}

          {aiResponse && (
            <div className="bg-slate-800/40 rounded-xl p-5 text-slate-300 leading-relaxed text-sm animate-in fade-in zoom-in-95 duration-300 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3 text-indigo-400 font-bold uppercase text-[10px] tracking-wider">
                    <Shield size={12} /> Expert Recommendation
                </div>
                <div className="whitespace-pre-wrap">{aiResponse}</div>
            </div>
          )}
        </div>

        <form onSubmit={handleAiSubmit} className="relative">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Describe your issue or request a script..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={isAiLoading || !aiInput.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-800 transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
            "Fix 'command not found: java'",
            "Setup Gradle with Kotlin DSL",
            "Termux backup script"
        ].map(suggestion => (
            <button 
                key={suggestion}
                onClick={() => setAiInput(suggestion)}
                className="text-left px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 hover:border-indigo-500 transition-colors"
            >
                {suggestion}
            </button>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
       <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Essential Resources</h2>
        <p className="text-slate-400">Official documentation and community links for further learning.</p>
      </header>

      <div className="space-y-4">
        {[
          { title: "Termux Wiki", desc: "The definitive guide for all things Termux.", url: "https://wiki.termux.com" },
          { title: "OpenJDK Docs", desc: "Official documentation for Java platform standards.", url: "https://docs.oracle.com/en/java/javase/17/" },
          { title: "Gradle User Manual", desc: "Master complex builds with official Gradle documentation.", url: "https://docs.gradle.org/current/userguide/userguide.html" },
          { title: "GitHub Actions Guide", desc: "Learn more about workflow syntax and automation.", url: "https://docs.github.com/en/actions" }
        ].map(link => (
          <a 
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all group"
          >
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{link.title}</h3>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </div>
            <ExternalLink size={20} className="text-slate-600 group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
            <Shield className="text-yellow-500" />
            <h3 className="text-lg font-bold text-yellow-500">Important Note</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
            Always remember to download Termux from <strong>F-Droid</strong> or the official GitHub releases. 
            The version on Google Play Store is deprecated and will not receive updates for package management.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.SETUP: return renderSetup();
      case AppTab.SOURCES: return renderSources();
      case AppTab.ACTIONS: return renderActions();
      case AppTab.AI_ASSISTANT: return renderAi();
      case AppTab.RESOURCES: return renderResources();
      default: return renderSetup();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
