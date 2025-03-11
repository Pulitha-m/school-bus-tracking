import React, { useState } from "react";
import { MessageSquareIcon, SearchIcon, PlusIcon } from "lucide-react";

export function DriverNotes() {
  const initialNotes = [
    {
      id: 1,
      date: "2023-06-14",
      author: "John Smith",
      authorRole: "Driver",
      content:
        "Alex was picked up 2 minutes late due to traffic congestion on Main Street.",
      priority: "low",
    },
    {
      id: 2,
      date: "2023-06-12",
      author: "Sarah Williams",
      authorRole: "School Admin",
      content: "Please remind Alex to bring his science project tomorrow.",
      priority: "medium",
    },
    {
      id: 3,
      date: "2023-06-09",
      author: "Mike Johnson",
      authorRole: "Driver",
      content:
        "Alex's parents requested a slight change in pickup location. Please stop at the corner of Maple and Oak streets instead of directly in front of the house.",
      priority: "high",
    },
    {
      id: 4,
      date: "2023-06-07",
      author: "Lisa Chen",
      authorRole: "Teacher",
      content:
        "Alex will be staying late for math club on Friday. Please adjust pickup accordingly.",
      priority: "medium",
    },
  ];

  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [priority, setPriority] = useState("low");

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = () => {
    if (newNote.trim() === "") return;
    const newNoteObj = {
      id: notes.length + 1,
      date: new Date().toISOString().split("T")[0],
      author: "You",
      authorRole: "Parent",
      content: newNote,
      priority,
    };
    setNotes([newNoteObj, ...notes]);
    setNewNote("");
    setPriority("low");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Driver Notes</h1>

      {/* Add New Note */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add New Note</h3>
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your note here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
          ></textarea>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    priority === "low"
                      ? "bg-green-100 text-green-800 border-2 border-green-300"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    priority === "medium"
                      ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    priority === "high"
                      ? "bg-red-100 text-red-800 border-2 border-red-300"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  High
                </button>
              </div>
            </div>
            <button
              onClick={handleAddNote}
              className="ml-auto px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors flex items-center"
            >
              <PlusIcon size={16} className="mr-1" />
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <MessageSquareIcon size={20} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {note.author}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {note.authorRole} • {formatDate(note.date)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          note.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : note.priority === "medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {note.priority.charAt(0).toUpperCase() +
                          note.priority.slice(1)}{" "}
                        Priority
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{note.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No notes found. Try adjusting your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
