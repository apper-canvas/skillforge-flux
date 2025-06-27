import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityService = {
  async getAll() {
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
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "replies" } },
          { field: { Name: "views" } },
          { field: { Name: "is_pinned" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          {
            fieldName: "is_pinned",
            sorttype: "DESC"
          },
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Discussion', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(discussion => ({
        Id: discussion.Id,
        title: discussion.title || discussion.Name,
        content: discussion.content,
        category: discussion.category,
        author: discussion.author,
        replies: discussion.replies || 0,
        views: discussion.views || 0,
        createdAt: discussion.created_at,
        isPinned: discussion.is_pinned || false,
        tags: discussion.Tags ? discussion.Tags.split(',').map(tag => tag.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching discussions:", error);
      return [];
    }
  },

  async getById(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    
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
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "replies" } },
          { field: { Name: "views" } },
          { field: { Name: "is_pinned" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_Discussion', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Discussion not found');
      }
      
      // Increment views count
      try {
        const updateParams = {
          records: [{
            Id: id,
            views: (response.data.views || 0) + 1
          }]
        };
        await apperClient.updateRecord('app_Discussion', updateParams);
      } catch (updateError) {
        console.warn("Failed to increment view count:", updateError);
      }
      
      return {
        Id: response.data.Id,
        title: response.data.title || response.data.Name,
        content: response.data.content,
        category: response.data.category,
        author: response.data.author,
        replies: response.data.replies || 0,
        views: (response.data.views || 0) + 1,
        createdAt: response.data.created_at,
        isPinned: response.data.is_pinned || false,
        tags: response.data.Tags ? response.data.Tags.split(',').map(tag => tag.trim()) : []
      };
    } catch (error) {
      console.error(`Error fetching discussion with ID ${id}:`, error);
      throw error;
    }
  },

  async create(discussionData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: discussionData.title,
          title: discussionData.title,
          content: discussionData.content,
          category: discussionData.category,
          author: discussionData.author,
          replies: 0,
          views: 0,
          is_pinned: discussionData.isPinned || false,
          created_at: new Date().toISOString(),
          Tags: discussionData.tags ? discussionData.tags.join(',') : ''
        }]
      };
      
      const response = await apperClient.createRecord('app_Discussion', params);
      
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
          const newDiscussion = successfulRecords[0].data;
          return {
            Id: newDiscussion.Id,
            title: newDiscussion.title || newDiscussion.Name,
            content: newDiscussion.content,
            category: newDiscussion.category,
            author: newDiscussion.author,
            replies: newDiscussion.replies || 0,
            views: newDiscussion.views || 0,
            createdAt: newDiscussion.created_at,
            isPinned: newDiscussion.is_pinned || false,
            tags: newDiscussion.Tags ? newDiscussion.Tags.split(',').map(tag => tag.trim()) : []
          };
        }
      }
      
      throw new Error('Failed to create discussion');
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },

  async update(Id, discussionData) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: id
      };
      
      if (discussionData.title !== undefined) {
        updateData.title = discussionData.title;
        updateData.Name = discussionData.title;
      }
      if (discussionData.content !== undefined) {
        updateData.content = discussionData.content;
      }
      if (discussionData.category !== undefined) {
        updateData.category = discussionData.category;
      }
      if (discussionData.isPinned !== undefined) {
        updateData.is_pinned = discussionData.isPinned;
      }
      if (discussionData.tags !== undefined) {
        updateData.Tags = discussionData.tags.join(',');
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('app_Discussion', params);
      
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
          const updatedDiscussion = successfulUpdates[0].data;
          return {
            Id: updatedDiscussion.Id,
            title: updatedDiscussion.title || updatedDiscussion.Name,
            content: updatedDiscussion.content,
            category: updatedDiscussion.category,
            author: updatedDiscussion.author,
            replies: updatedDiscussion.replies || 0,
            views: updatedDiscussion.views || 0,
            createdAt: updatedDiscussion.created_at,
            isPinned: updatedDiscussion.is_pinned || false,
            tags: updatedDiscussion.Tags ? updatedDiscussion.Tags.split(',').map(tag => tag.trim()) : []
          };
        }
      }
      
      throw new Error('Failed to update discussion');
    } catch (error) {
      console.error("Error updating discussion:", error);
      throw error;
    }
  },

  async delete(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('app_Discussion', params);
      
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
      console.error("Error deleting discussion:", error);
      throw error;
    }
  },

  // Thread replies management
  async getThreadReplies(threadId) {
    const id = parseInt(threadId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid thread ID');
    }
    
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
          { field: { Name: "content" } },
          { field: { Name: "author" } },
          { field: { Name: "created_at" } },
          { field: { Name: "likes" } },
          { field: { Name: "thread_id" } },
          { field: { Name: "parent_reply_id" } }
        ],
        where: [
          {
            FieldName: "thread_id",
            Operator: "EqualTo",
            Values: [id]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('thread_reply', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(reply => ({
        Id: reply.Id,
        threadId: reply.thread_id?.Name || reply.thread_id,
        content: reply.content,
        author: reply.author,
        createdAt: reply.created_at,
        likes: reply.likes || 0,
        parentReplyId: reply.parent_reply_id?.Name || reply.parent_reply_id
      }));
    } catch (error) {
      console.error(`Error fetching replies for thread ${threadId}:`, error);
      return [];
    }
  },

  async addReply(replyData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Reply to thread ${replyData.threadId}`,
          content: replyData.content,
          author: replyData.author,
          thread_id: parseInt(replyData.threadId),
          parent_reply_id: replyData.parentReplyId || null,
          likes: 0,
          created_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('thread_reply', params);
      
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
          const newReply = successfulRecords[0].data;
          
          // Update discussion reply count
          try {
            const discussionResponse = await apperClient.getRecordById('app_Discussion', parseInt(replyData.threadId), {
              fields: [{ field: { Name: "replies" } }]
            });
            
            if (discussionResponse.success && discussionResponse.data) {
              const updateParams = {
                records: [{
                  Id: parseInt(replyData.threadId),
                  replies: (discussionResponse.data.replies || 0) + 1
                }]
              };
              await apperClient.updateRecord('app_Discussion', updateParams);
            }
          } catch (updateError) {
            console.warn("Failed to update discussion reply count:", updateError);
          }
          
          return {
            Id: newReply.Id,
            threadId: newReply.thread_id?.Name || newReply.thread_id,
            content: newReply.content,
            author: newReply.author,
            createdAt: newReply.created_at,
            likes: newReply.likes || 0,
            parentReplyId: newReply.parent_reply_id?.Name || newReply.parent_reply_id
          };
        }
      }
      
      throw new Error('Failed to create reply');
    } catch (error) {
      console.error("Error creating reply:", error);
      throw error;
    }
  },

  async updateReply(Id, replyData) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: id
      };
      
      if (replyData.content !== undefined) {
        updateData.content = replyData.content;
      }
      if (replyData.likes !== undefined) {
        updateData.likes = replyData.likes;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('thread_reply', params);
      
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
          const updatedReply = successfulUpdates[0].data;
          return {
            Id: updatedReply.Id,
            threadId: updatedReply.thread_id?.Name || updatedReply.thread_id,
            content: updatedReply.content,
            author: updatedReply.author,
            createdAt: updatedReply.created_at,
            likes: updatedReply.likes || 0,
            parentReplyId: updatedReply.parent_reply_id?.Name || updatedReply.parent_reply_id
          };
        }
      }
      
      throw new Error('Failed to update reply');
    } catch (error) {
      console.error("Error updating reply:", error);
      throw error;
    }
  },

  async deleteReply(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Get the reply to update discussion count
      const replyResponse = await apperClient.getRecordById('thread_reply', id, {
        fields: [{ field: { Name: "thread_id" } }]
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('thread_reply', params);
      
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
        
        if (successfulDeletions.length > 0) {
          // Update discussion reply count
          if (replyResponse.success && replyResponse.data) {
            try {
              const threadId = replyResponse.data.thread_id?.Name || replyResponse.data.thread_id;
              const discussionResponse = await apperClient.getRecordById('app_Discussion', parseInt(threadId), {
                fields: [{ field: { Name: "replies" } }]
              });
              
              if (discussionResponse.success && discussionResponse.data) {
                const updateParams = {
                  records: [{
                    Id: parseInt(threadId),
                    replies: Math.max((discussionResponse.data.replies || 0) - 1, 0)
                  }]
                };
                await apperClient.updateRecord('app_Discussion', updateParams);
              }
            } catch (updateError) {
              console.warn("Failed to update discussion reply count:", updateError);
            }
          }
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  },

  async likeReply(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    
    try {
      await delay(150);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Get current likes count
      const replyResponse = await apperClient.getRecordById('thread_reply', id, {
        fields: [{ field: { Name: "likes" } }]
      });
      
      if (!replyResponse.success || !replyResponse.data) {
        throw new Error('Reply not found');
      }
      
      const params = {
        records: [{
          Id: id,
          likes: (replyResponse.data.likes || 0) + 1
        }]
      };
      
      const response = await apperClient.updateRecord('thread_reply', params);
      
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
          const updatedReply = successfulUpdates[0].data;
          return {
            Id: updatedReply.Id,
            threadId: updatedReply.thread_id?.Name || updatedReply.thread_id,
            content: updatedReply.content,
            author: updatedReply.author,
            createdAt: updatedReply.created_at,
            likes: updatedReply.likes || 0,
            parentReplyId: updatedReply.parent_reply_id?.Name || updatedReply.parent_reply_id
          };
        }
      }
      
      throw new Error('Failed to like reply');
    } catch (error) {
      console.error("Error liking reply:", error);
      throw error;
    }
  }
};