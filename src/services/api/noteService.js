import mockNotes from '@/services/mockData/notes';

let notesData = [...mockNotes];
let lastId = Math.max(...notesData.map(note => note.Id), 0);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const noteService = {
  async getByVideoId(videoId) {
    await delay(300);
    return notesData.filter(note => note.videoId === videoId).sort((a, b) => a.timestamp - b.timestamp);
  },

  async getById(id) {
    await delay(200);
    const note = notesData.find(note => note.Id === parseInt(id));
    if (!note) {
      throw new Error('Note not found');
    }
    return { ...note };
  },

  async create(noteData) {
    await delay(500);
    const newNote = {
      Id: ++lastId,
      videoId: noteData.videoId,
      timestamp: noteData.timestamp,
      content: noteData.content,
      createdAt: noteData.createdAt || new Date().toISOString()
    };
    notesData.push(newNote);
    return { ...newNote };
  },

  async update(id, updates) {
    await delay(400);
    const index = notesData.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    notesData[index] = {
      ...notesData[index],
      ...updates,
      Id: notesData[index].Id // Prevent Id changes
    };
    
    return { ...notesData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = notesData.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    notesData.splice(index, 1);
    return true;
  }
};