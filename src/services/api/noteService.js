import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const noteService = {
  async getByVideoId(videoId) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "video_id" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "video_id",
            Operator: "EqualTo",
            Values: [videoId]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(note => ({
        Id: note.Id,
        videoId: note.video_id,
        timestamp: note.timestamp,
        content: note.content,
        createdAt: note.created_at
      }));
    } catch (error) {
      console.error("Error fetching notes by video ID:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "video_id" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('note', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Note not found');
      }
      
      return {
        Id: response.data.Id,
        videoId: response.data.video_id,
        timestamp: response.data.timestamp,
        content: response.data.content,
        createdAt: response.data.created_at
      };
    } catch (error) {
      console.error(`Error fetching note with ID ${id}:`, error);
      throw error;
    }
  },

  async create(noteData) {
    try {
      await delay(500);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Note at ${noteData.timestamp}s`,
          video_id: noteData.videoId,
          timestamp: noteData.timestamp,
          content: noteData.content,
          created_at: noteData.createdAt || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newNote = successfulRecords[0].data;
          return {
            Id: newNote.Id,
            videoId: newNote.video_id,
            timestamp: newNote.timestamp,
            content: newNote.content,
            createdAt: newNote.created_at
          };
        }
      }
      
      throw new Error('Failed to create note');
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.content !== undefined) {
        updateData.content = updates.content;
      }
      if (updates.timestamp !== undefined) {
        updateData.timestamp = updates.timestamp;
      }
      if (updates.videoId !== undefined) {
        updateData.video_id = updates.videoId;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedNote = successfulUpdates[0].data;
          return {
            Id: updatedNote.Id,
            videoId: updatedNote.video_id,
            timestamp: updatedNote.timestamp,
            content: updatedNote.content,
            createdAt: updatedNote.created_at
          };
        }
      }
      
      throw new Error('Failed to update note');
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  }
};