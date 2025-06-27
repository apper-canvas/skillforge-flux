import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';
import { noteService } from '@/services/api/noteService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotesPanel = ({ notes, onNoteAdd, onNoteSeek, onNotesUpdate, currentTimestamp, videoId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      setLoading(true);
      await onNoteAdd(currentTimestamp, newNoteContent.trim());
      setNewNoteContent('');
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = async (noteId) => {
    if (!editContent.trim()) return;

    try {
      setLoading(true);
      const updatedNote = await noteService.update(noteId, {
        content: editContent.trim()
      });
      
      const updatedNotes = notes.map(note => 
        note.Id === noteId ? updatedNote : note
      );
      onNotesUpdate(updatedNotes);
      
      setEditingNote(null);
      setEditContent('');
      toast.success('Note updated successfully');
    } catch (err) {
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setLoading(true);
      await noteService.delete(noteId);
      
      const updatedNotes = notes.filter(note => note.Id !== noteId);
      onNotesUpdate(updatedNotes);
      
      toast.success('Note deleted successfully');
    } catch (err) {
      toast.error('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (note) => {
    setEditingNote(note.Id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg h-fit"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="FileText" size={20} className="text-primary-500" />
            <h3 className="font-semibold text-gray-800">Notes</h3>
            <span className="text-sm text-gray-500">({notes.length})</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-gray-500" 
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Add New Note */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Add note at {formatTime(currentTimestamp)}
                  </span>
                </div>
                <div className="space-y-2">
                  <TextareaAutosize
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Enter your note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    minRows={2}
                    maxRows={4}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNoteContent.trim() || loading}
                    loading={loading}
                    size="sm"
                    icon="Plus"
                    className="w-full"
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="text-sm font-medium text-gray-700 border-t pt-3">
                    Your Notes
                  </div>
                  {notes.map((note) => (
                    <motion.div
                      key={note.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-3 space-y-2"
                    >
                      {/* Note Header */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onNoteSeek(note.timestamp)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <ApperIcon name="Play" size={14} />
                          <span className="text-sm font-medium">
                            {formatTime(note.timestamp)}
                          </span>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(note)}
                            disabled={loading}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.Id)}
                            disabled={loading}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Note Content */}
                      {editingNote === note.Id ? (
                        <div className="space-y-2">
                          <TextareaAutosize
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            minRows={2}
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleEditNote(note.Id)}
                              disabled={!editContent.trim() || loading}
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              size="sm"
                              variant="ghost"
                              className="text-xs px-2 py-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {note.content}
                        </p>
                      )}

                      {/* Note Date */}
                      <div className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs">Add your first note above</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotesPanel;