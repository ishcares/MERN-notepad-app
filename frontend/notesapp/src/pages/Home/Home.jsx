import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiPlus, 
  FiTrash2, 
  FiStar, 
  FiLogOut, 
  FiSearch, 
  FiCheck,
  FiLoader
} from "react-icons/fi";
import {
  getNotes,
  addNote,
  editNote,
  deleteNote,
  pinNote,
  searchNotes,
} from "../../api/notes";

const Home = () => {
  const navigate = useNavigate();

  // 1️⃣ STATE DEFINITIONS
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);

  // 2️⃣ AUTH CHECK & LOGOUT
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }
    // Get stored user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
    fetchNotes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 3️⃣ FETCH NOTES
  const fetchNotes = async (query = "", selectFirst = false) => {
    try {
      let data;
      if (query && query.trim() !== "") {
        data = await searchNotes(query);
      } else {
        data = await getNotes();
      }
      const fetchedNotes = data.notes || [];
      setNotes(fetchedNotes);
      
      // Select first note if requested and available
      if (selectFirst && fetchedNotes.length > 0) {
        setActiveNote(fetchedNotes[0]);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast.error(err.message || "Failed to load notes");
    }
  };

  // Debounce search input
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchNotes(searchText);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchText]);

  // Sync active note fields
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || "");
      setContent(activeNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeNote]);

  // 4️⃣ AUTO-SAVE DEBOUNCE EFFECT
  useEffect(() => {
    if (!activeNote) return;

    // Check if anything has actually changed
    if (title === activeNote.title && content === activeNote.content) {
      return;
    }

    setIsSaving(true);
    const delaySave = setTimeout(async () => {
      try {
        const payload = {
          title,
          content,
          tags: activeNote.tags || [],
        };
        const res = await editNote(activeNote._id, payload);
        if (res.success) {
          // Update notes array locally in-place
          setNotes((prev) =>
            prev.map((n) => (n._id === activeNote._id ? res.note : n))
          );
          // Sync activeNote model data without resetting UI cursor
          activeNote.title = res.note.title;
          activeNote.content = res.note.content;
        }
      } catch (err) {
        console.error("Auto-save error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1-second debounce for typing comfort

    return () => clearTimeout(delaySave);
  }, [title, content, activeNote]);

  // 5️⃣ ACTIONS: ADD, DELETE, PIN
  const handleAddNote = async () => {
    try {
      const payload = {
        title: "Untitled Note",
        content: "",
        tags: [],
      };
      const res = await addNote(payload);
      if (res.success) {
        setNotes((prev) => [res.note, ...prev]);
        setActiveNote(res.note);
      }
    } catch (err) {
      console.error("Error creating note:", err);
      toast.error("Failed to create a new note");
    }
  };

  const handleDeleteNote = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (activeNote && activeNote._id === id) {
        setActiveNote(null);
      }
      toast.success("Note deleted");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await pinNote(id);
      setNotes((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isPinned: !n.isPinned } : n
        )
      );
      if (activeNote && activeNote._id === id) {
        setActiveNote((prev) => ({ ...prev, isPinned: !prev.isPinned }));
      }
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  // 6️⃣ FORMATTING TOOLBAR HELPERS
  const handleFormat = (type) => {
    const textarea = document.getElementById("note-editor-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    const selected = val.substring(start, end);

    let replacement = "";
    if (type === "bold") replacement = `**${selected}**`;
    else if (type === "italic") replacement = `*${selected}*`;
    else if (type === "underline") replacement = `_${selected}_`;
    else if (type === "h1") replacement = `# ${selected}`;
    else if (type === "h2") replacement = `## ${selected}`;
    else if (type === "h3") replacement = `### ${selected}`;

    const newVal = val.substring(0, start) + replacement + val.substring(end);
    setContent(newVal);

    // Maintain caret focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  // Sort pinned items to the top
  const sortedNotes = [...notes].sort((a, b) => b.isPinned - a.isPinned);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FCFDFD] text-[#2C3B2E]">
      
      {/* 🟢 LEFT SIDEBAR */}
      <div className="w-[320px] flex-shrink-0 flex flex-col bg-[#EAEFEA] border-r border-[#D9E4DD] p-5 h-full select-none">
        
        {/* User Block & App Title */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#2C3B2E] tracking-tight">Journal</h1>
            <p className="text-xs text-[#5C6B5E] mt-0.5">
              {user?.fullName ? `Hello, ${user.fullName.split(" ")[0]}` : (user?.email ? `Hello, ${user.email.split("@")[0]}` : "Your thoughts")}
            </p>
          </div>
          
          {/* Logout Icon */}
          <button 
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#D9E4DD] rounded-[12px] transition duration-200"
          >
            <FiLogOut size={16} />
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="relative mb-5">
          <FiSearch className="absolute left-3 top-3.5 text-[#5C6B5E] pointer-events-none" size={14} />
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-[#FCFDFD] border border-[#D9E4DD] outline-none rounded-[12px] pl-9 pr-4 py-2.5 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition focus:border-[#4A6B53]"
          />
        </div>

        {/* Ghost Style Add Note Button */}
        <button
          onClick={handleAddNote}
          className="w-full flex items-center justify-center space-x-2 border border-[#D9E4DD] hover:bg-[#D9E4DD] py-2.5 text-sm font-medium rounded-[12px] text-[#2C3B2E] transition duration-300 ease-in-out mb-5 group bg-[#FCFDFD]"
        >
          <FiPlus size={16} className="text-[#5C6B5E] group-hover:text-[#2C3B2E] transition" />
          <span>New Entry</span>
        </button>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto minimal-scrollbar space-y-1.5">
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => {
              const isActive = activeNote && activeNote._id === note._id;
              const preview = note.content ? note.content.replace(/[#*`_]/g, "").substring(0, 45) + "..." : "Empty entry";
              
              return (
                <div
                  key={note._id}
                  onClick={() => setActiveNote(note)}
                  className={`group w-full text-left p-3.5 rounded-[12px] cursor-pointer transition duration-300 relative flex flex-col ${
                    isActive 
                      ? "bg-[#D9E4DD] text-[#2C3B2E]" 
                      : "hover:bg-[#D9E4DD] hover:bg-opacity-40 text-[#2C3B2E]"
                  }`}
                >
                  {/* Note header row: title & pin */}
                  <div className="flex justify-between items-start space-x-2">
                    <span className={`text-sm block truncate max-w-[200px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {note.title || "Untitled Note"}
                    </span>
                    
                    {/* Hover controls / Pin icon */}
                    <div className="flex items-center space-x-1">
                      {note.isPinned && (
                        <FiStar size={12} className="fill-[#4A6B53] text-[#4A6B53]" />
                      )}
                    </div>
                  </div>

                  {/* Note preview row */}
                  <span className="text-xs text-[#5C6B5E] mt-1 truncate block max-w-[260px]">
                    {preview}
                  </span>

                  {/* Absolute Delete Button on Hover */}
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 p-1.5 text-[#5C6B5E] hover:text-red-700 hover:bg-[#FCFDFD] rounded-md transition duration-200"
                    title="Delete Entry"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-[#5C6B5E]">No entries found</p>
            </div>
          )}
        </div>
      </div>

      {/* 🔵 RIGHT WRITING AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#FCFDFD]">
        {activeNote ? (
          <div className="flex-1 flex flex-col h-full p-10 max-w-[900px] w-full mx-auto">
            
            {/* Top Toolbar Header Row */}
            <div className="flex items-center justify-between border-b border-[#D9E4DD] pb-4 mb-6">
              
              {/* Thin Toolbar */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleFormat("bold")}
                  title="Bold"
                  className="p-2 text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  <FiBold size={15} />
                </button>
                
                <button
                  onClick={() => handleFormat("italic")}
                  title="Italic"
                  className="p-2 text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  <FiItalic size={15} />
                </button>
                
                <button
                  onClick={() => handleFormat("underline")}
                  title="Underline"
                  className="p-2 text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  <FiUnderline size={15} />
                </button>

                <div className="w-[1px] h-4 bg-[#D9E4DD] mx-2"></div>

                <button
                  onClick={() => handleFormat("h1")}
                  className="px-2 py-1 text-xs font-semibold text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  H1
                </button>
                
                <button
                  onClick={() => handleFormat("h2")}
                  className="px-2 py-1 text-xs font-semibold text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  H2
                </button>
                
                <button
                  onClick={() => handleFormat("h3")}
                  className="px-2 py-1 text-xs font-semibold text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA] rounded-[8px] transition"
                >
                  H3
                </button>
              </div>

              {/* Status / Saved / Pin / Delete Controls */}
              <div className="flex items-center space-x-3 text-xs text-[#5C6B5E]">
                
                {/* Auto-save Status Indicator */}
                <div className="flex items-center space-x-1.5 min-w-[70px] justify-end">
                  {isSaving ? (
                    <>
                      <FiLoader size={12} className="animate-spin text-[#4A6B53]" />
                      <span className="text-[#4A6B53]">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={13} className="text-[#4A6B53]" />
                      <span className="text-[#4A6B53]">Saved</span>
                    </>
                  )}
                </div>

                <div className="w-[1px] h-4 bg-[#D9E4DD]"></div>

                {/* Pin Note */}
                <button
                  onClick={(e) => handleTogglePin(activeNote._id, e)}
                  title={activeNote.isPinned ? "Unpin Note" : "Pin Note"}
                  className={`p-2 rounded-[8px] transition ${
                    activeNote.isPinned 
                      ? "text-[#4A6B53] bg-[#EAEFEA] hover:bg-[#D9E4DD]" 
                      : "text-[#5C6B5E] hover:text-[#2C3B2E] hover:bg-[#EAEFEA]"
                  }`}
                >
                  <FiStar size={15} className={activeNote.isPinned ? "fill-[#4A6B53] text-[#4A6B53]" : ""} />
                </button>

                {/* Delete Note */}
                <button
                  onClick={(e) => handleDeleteNote(activeNote._id, e)}
                  title="Delete Note"
                  className="p-2 text-[#5C6B5E] hover:text-red-700 hover:bg-red-50 rounded-[8px] transition"
                >
                  <FiTrash2 size={15} />
                </button>

              </div>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 flex flex-col space-y-4">
              
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Note"
                className="w-full bg-transparent text-2xl font-semibold text-[#2C3B2E] border-none outline-none placeholder-[#A0B0A4] py-1 focus:ring-0"
              />

              {/* Generous spacing writing pad */}
              <textarea
                id="note-editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing your reflections here..."
                className="w-full flex-1 bg-transparent text-sm text-[#2C3B2E] border-none outline-none resize-none placeholder-[#A0B0A4] leading-[1.8] focus:ring-0"
              />
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#FCFDFD]">
            <div className="max-w-sm">
              <h2 className="text-lg font-medium text-[#2C3B2E] mb-2">A Quiet Workspace</h2>
              <p className="text-xs text-[#5C6B5E] leading-relaxed mb-6">
                Whitespace is the design. Select an existing entry from the journal list or create a new one to begin typing.
              </p>
              <button
                onClick={handleAddNote}
                className="inline-flex items-center space-x-2 border border-[#D9E4DD] hover:bg-[#EAEFEA] px-6 py-2.5 text-sm font-medium rounded-[12px] text-[#2C3B2E] transition duration-300 bg-white"
              >
                <FiPlus size={16} className="text-[#5C6B5E]" />
                <span>Create First Entry</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
