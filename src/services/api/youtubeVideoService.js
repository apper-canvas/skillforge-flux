import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const youtubeVideoService = {
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
          { field: { Name: "video_id" } },
          { 
            field: { Name: "course_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "url" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('youtube_video', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(video => ({
        id: video.Id.toString(),
        videoId: video.video_id,
        courseId: video.course_id?.Id?.toString() || '',
        courseName: video.course_id?.Name || '',
        title: video.title || video.Name,
        description: video.description,
        url: video.url
      }));
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
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
          { field: { Name: "Tags" } },
          { field: { Name: "video_id" } },
          { 
            field: { Name: "course_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "url" } }
        ]
      };
      
      const response = await apperClient.getRecordById('youtube_video', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('YouTube video not found');
      }
      
      return {
        id: response.data.Id.toString(),
        videoId: response.data.video_id,
        courseId: response.data.course_id?.Id?.toString() || '',
        courseName: response.data.course_id?.Name || '',
        title: response.data.title || response.data.Name,
        description: response.data.description,
        url: response.data.url
      };
    } catch (error) {
      console.error(`Error fetching YouTube video with ID ${id}:`, error);
      throw error;
    }
  },

  async getByCourseId(courseId) {
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
          { field: { Name: "course_id" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "url" } }
        ],
        where: [
          {
            FieldName: "course_id",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('youtube_video', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(video => ({
        id: video.Id.toString(),
        videoId: video.video_id,
        courseId: video.course_id?.toString() || courseId,
        title: video.title || video.Name,
        description: video.description,
        url: video.url,
        type: 'youtube'
      }));
    } catch (error) {
      console.error(`Error fetching YouTube videos for course ${courseId}:`, error);
      return [];
    }
  },

  async create(videoData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: videoData.title,
          video_id: videoData.videoId,
          course_id: parseInt(videoData.courseId),
          title: videoData.title,
          description: videoData.description,
          url: videoData.url
        }]
      };
      
      const response = await apperClient.createRecord('youtube_video', params);
      
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
          const newVideo = successfulRecords[0].data;
          return {
            id: newVideo.Id.toString(),
            videoId: newVideo.video_id,
            courseId: newVideo.course_id?.toString() || videoData.courseId,
            title: newVideo.title || newVideo.Name,
            description: newVideo.description,
            url: newVideo.url
          };
        }
      }
      
      throw new Error('Failed to create YouTube video');
    } catch (error) {
      console.error("Error creating YouTube video:", error);
      throw error;
    }
  },

  async update(id, videoData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: videoData.title,
          video_id: videoData.videoId,
          course_id: parseInt(videoData.courseId),
          title: videoData.title,
          description: videoData.description,
          url: videoData.url
        }]
      };
      
      const response = await apperClient.updateRecord('youtube_video', params);
      
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
          const updatedVideo = successfulUpdates[0].data;
          return {
            id: updatedVideo.Id.toString(),
            videoId: updatedVideo.video_id,
            courseId: updatedVideo.course_id?.toString() || videoData.courseId,
            title: updatedVideo.title || updatedVideo.Name,
            description: updatedVideo.description,
            url: updatedVideo.url
          };
        }
      }
      
      throw new Error('Failed to update YouTube video');
    } catch (error) {
      console.error("Error updating YouTube video:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('youtube_video', params);
      
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
      console.error("Error deleting YouTube video:", error);
      throw error;
    }
  }
};