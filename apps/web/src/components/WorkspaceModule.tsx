"use client";

import React, { useState } from "react";
import { useForgeStore } from "@/stores/useStore";
import { 
  FileText, 
  CheckSquare, 
  History, 
  Video, 
  Send,
  Plus,
  Play,
  CheckCircle,
  FileUp,
  BrainCircuit,
  Loader2,
  Trash2
} from "lucide-react";

export default function WorkspaceModule() {
  const { 
    startups, 
    activeStartupId, 
    documents, 
    tasks, 
    addDocument, 
    updateDocument, 
    addTask, 
    updateTask 
  } = useForgeStore();

  const [activeTab, setActiveTab] = useState<"docs" | "tasks" | "meetings">("docs");
  
  // Doc Hub state
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-1");
  const [editingContent, setEditingContent] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");

  // Meeting states
  const [transcript, setTranscript] = useState("");
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [meetingLoading, setMeetingLoading] = useState(false);

  const activeStartup = startups.find(s => s.id === activeStartupId) || startups[0];

  if (!activeStartup) {
    return (
      <div className="bg-white border border-neutral-100 p-12 rounded-2xl text-center shadow-soft max-w-xl mx-auto">
        <Video size={36} className="text-neutral-300 mx-auto mb-3" />
        <span className="text-xs text-neutral-500 font-medium block">No Active Startup Workspace Provisioned</span>
        <p className="text-[11px] text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Please validate your concept inside the Validation OS, and incorporate it inside the Startup Creation module first to spin up a company workspace.
        </p>
      </div>
    );
  }

  // Handle doc edits
  const activeDoc = documents.find(d => d.id === selectedDocId);
  const handleSaveDoc = () => {
    if (!activeDoc) return;
    updateDocument(activeDoc.id!, { content: editingContent });
    alert("Document updated locally!");
  };

  const handleCreateDoc = () => {
    if (!newDocTitle) return;
    const newId = `doc-${Date.now()}`;
    addDocument({
      id: newId,
      startupId: activeStartup.id!,
      title: newDocTitle,
      content: `# ${newDocTitle}\n\nStart writing strategy guidelines...`,
      category: "general",
      authorId: "user-123"
    });
    setSelectedDocId(newId);
    setEditingContent(`# ${newDocTitle}\n\nStart writing strategy guidelines...`);
    setNewDocTitle("");
  };

  // Handle task submissions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      id: `task-${Date.now()}`,
      startupId: activeStartup.id!,
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority
    });
    setNewTaskTitle("");
  };

  // Handle meeting summary
  const handleSummarizeMeeting = async () => {
    if (!transcript.trim()) return;
    setMeetingLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${API_URL}/api/ai/summarize-meeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript })
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setAiSummary(data);
    } catch (err) {
      console.error(err);
      alert("Could not connect to local AI Service on port 8000. Please start your FastAPI server.");
    } finally {
      setMeetingLoading(false);
    }
  };

  const handleAddSuggestedTask = (title: string) => {
    addTask({
      id: `task-suggest-${Date.now()}`,
      startupId: activeStartup.id!,
      title,
      status: "todo",
      priority: "medium"
    });
    alert(`Added task: "${title}" to your Kanban todo backlog!`);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
            {activeStartup.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{activeStartup.name}</h1>
            <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Workspace OS
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-neutral-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-1 px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeTab === "docs" ? "bg-white text-brand-700 shadow-sm" : "text-neutral-500"
            }`}
          >
            <FileText size={12} /> Strategy Hub
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-1 px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeTab === "tasks" ? "bg-white text-brand-700 shadow-sm" : "text-neutral-500"
            }`}
          >
            <CheckSquare size={12} /> Task Kanban
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`flex items-center gap-1 px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeTab === "meetings" ? "bg-white text-brand-700 shadow-sm" : "text-neutral-500"
            }`}
          >
            <Video size={12} /> AI Meeting Notes
          </button>
        </div>
      </div>

      {/* Content Render based on active tab */}
      {activeTab === "docs" && (
        <div className="grid grid-cols-4 gap-6">
          {/* Docs list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Documents</h3>
            <div className="space-y-1.5">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id!);
                    setEditingContent(doc.content);
                  }}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left border ${
                    selectedDocId === doc.id
                      ? "bg-brand-50/50 border-brand-300 text-brand-800"
                      : "bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200"
                  }`}
                >
                  <FileText size={14} className="text-neutral-400" />
                  <span className="truncate">{doc.title}</span>
                </button>
              ))}
            </div>

            {/* Quick add doc */}
            <div className="pt-4 border-t border-neutral-100">
              <input
                type="text"
                value={newDocTitle}
                onChange={e => setNewDocTitle(e.target.value)}
                placeholder="New doc name..."
                className="w-full text-xs border border-neutral-200 p-2 rounded-lg mb-2 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleCreateDoc}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <Plus size={10} /> Create Doc
              </button>
            </div>
          </div>

          {/* Doc editor */}
          <div className="col-span-3 bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-4">
            {activeDoc ? (
              <>
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="font-bold text-neutral-800 text-sm">{activeDoc.title}</h3>
                  <button
                    onClick={handleSaveDoc}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                  >
                    Save Changes
                  </button>
                </div>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={15}
                  className="w-full border-0 text-xs font-mono leading-relaxed focus:outline-none bg-neutral-50/50 p-4 rounded-xl"
                  placeholder="Markdown content goes here..."
                />
              </>
            ) : (
              <div className="text-center p-12 text-xs text-neutral-400">
                Select a document to edit.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Quick Task add */}
          <form onSubmit={handleAddTask} className="bg-white border border-neutral-100 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 text-xs max-w-2xl">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Schedule co-founder agreement drafting..."
              className="flex-1 border border-neutral-200 p-2.5 rounded-lg focus:outline-none focus:border-brand-500"
            />
            <select
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value as any)}
              className="border border-neutral-200 p-2.5 rounded-lg bg-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-1"
            >
              <Plus size={12} /> Add Task
            </button>
          </form>

          {/* Kanban Columns */}
          <div className="grid grid-cols-3 gap-6">
            {/* Columns list */}
            {(["todo", "in_progress", "done"] as const).map((status) => {
              const statusTasks = tasks.filter(t => t.status === status);
              return (
                <div key={status} className="bg-neutral-50/60 p-4 rounded-2xl border border-neutral-100 flex flex-col min-h-[400px]">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="font-bold text-neutral-700 text-xs capitalize">
                      {status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] bg-neutral-200/80 px-2 py-0.5 rounded-full font-bold text-neutral-600">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {statusTasks.map((t) => (
                      <div key={t.id} className="bg-white border border-neutral-100/80 p-3.5 rounded-xl shadow-sm text-left space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            t.priority === "high" ? "bg-rose-100 text-rose-700" : "bg-neutral-100 text-neutral-500"
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <h4 className="font-semibold text-neutral-800 text-xs leading-snug">{t.title}</h4>
                        
                        {/* Status switcher arrows */}
                        <div className="flex justify-end pt-2 border-t border-neutral-100 gap-1.5">
                          {status !== "todo" && (
                            <button
                              onClick={() => updateTask(t.id!, { 
                                status: status === "done" ? "in_progress" : "todo" 
                              })}
                              className="text-[9px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-0.5"
                            >
                              ◀ Back
                            </button>
                          )}
                          {status !== "done" && (
                            <button
                              onClick={() => updateTask(t.id!, { 
                                status: status === "todo" ? "in_progress" : "done" 
                              })}
                              className="text-[9px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-0.5"
                            >
                              Move ▶
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "meetings" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Transcript input */}
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Video size={16} className="text-neutral-400" />
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Meeting Transcript Recorder
              </h3>
            </div>
            
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={12}
              placeholder="Paste raw conversation logs or transcript outputs here... e.g.
Alex: Let's agree on starting the waitlist page.
Sarah: Yes, I can build it. Let's make sure task items are logged."
              className="w-full border border-neutral-200 text-xs rounded-xl focus:outline-none focus:border-brand-500 bg-neutral-50/50 p-4 leading-relaxed"
            />
            
            <button
              onClick={handleSummarizeMeeting}
              disabled={meetingLoading || !transcript.trim()}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-40 flex items-center gap-1.5"
            >
              {meetingLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <BrainCircuit size={12} className="animate-pulse" />
              )}
              Summarize Meeting & Extract Actions
            </button>
          </div>

          {/* AI summaries */}
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
              AI Generated Synthesis
            </h3>
            
            {aiSummary ? (
              <div className="text-xs space-y-4 text-left">
                <div>
                  <span className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider block mb-1">Summary</span>
                  <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg leading-relaxed">{aiSummary.summary}</p>
                </div>
                
                <div>
                  <span className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider block mb-1">Key Decisions</span>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                    {aiSummary.decisions.map((dec: string, i: number) => (
                      <li key={i}>{dec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider block mb-1">Suggested Tasks</span>
                  <div className="space-y-1.5 mt-1.5">
                    {aiSummary.suggestedTasks.map((t: string, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-neutral-50 border border-neutral-100 px-3 py-2 rounded-lg text-[11px]">
                        <span className="text-neutral-800 font-medium truncate max-w-[70%]">{t}</span>
                        <button
                          onClick={() => handleAddSuggestedTask(t)}
                          className="bg-brand-50 hover:bg-brand-100 text-brand-700 px-2 py-1 rounded font-bold text-[10px] border border-brand-200"
                        >
                          + Add Task
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-xs text-neutral-400 leading-relaxed">
                Provide a transcript on the left and click "Summarize" to view automatic task assignments, agendas, and logs.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
