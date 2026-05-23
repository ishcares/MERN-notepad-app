import axiosInstance from "../utils/axiosInstance";

// Note: The /api/notes prefix is now explicit on all routes to resolve the 404 error.

// ✅ Get all notes
export const getNotes = async () => {
    try {
        const res = await axiosInstance.get("/notes"); 
        return res.data; // Expected: { success: true, notes: [...] }
    } catch (err) {
        throw err.response?.data || { message: "Failed to load notes" };
    }
};

// ✅ Add a new note
export const addNote = async (noteData) => {
    try {
        const res = await axiosInstance.post("/notes/add", noteData); 
        return res.data; // Expected: { success: true, note: {...} }
    } catch (err) {
        throw err.response?.data || { message: "Failed to add note" };
    }
};

// ✅ Edit an existing note
export const editNote = async (id, noteData) => {
    try {
        const res = await axiosInstance.put(`/notes/${id}`, noteData); 
        return res.data; // Expected: { success: true, note: {...} }
    } catch (err) {
        throw err.response?.data || { message: "Failed to edit note" };
    }
};

// ✅ Delete a note
export const deleteNote = async (id) => {
    try {
        const res = await axiosInstance.delete(`/notes/${id}`); 
        return res.data; // Expected: { success: true, message: "..." }
    } catch (err) {
        throw err.response?.data || { message: "Failed to delete note" };
    }
};

// ✅ Pin/Unpin a note
export const pinNote = async (id) => {
    try {
        // Uses the specific backend pin endpoint: /api/notes/pin/:id
        const res = await axiosInstance.put(`/notes/pin/${id}`); 
        return res.data; // Expected: { success: true, note: {...} }
    } catch (err) {
        throw err.response?.data || { message: "Failed to toggle pin" };
    }
};

// 🔍 Search notes
export const searchNotes = async (query) => {
    try {
        // Uses the specific backend search endpoint: /api/notes/search?q=query
        const res = await axiosInstance.get("/notes/search", { 
            params: { 
                q: query 
            } 
        });
        return res.data; // Expected: { success: true, notes: [...] }
    } catch (err) {
        throw err.response?.data || { message: "Failed to search notes" };
    }
};