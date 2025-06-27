import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
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
          { field: { Name: "description" } },
          { field: { Name: "instructor" } },
          { field: { Name: "duration" } },
          { field: { Name: "subject" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "modules" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('course', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(course => ({
        id: course.Id.toString(),
        title: course.title || course.Name,
        subject: course.subject,
        difficulty: course.difficulty,
        instructor: course.instructor,
        duration: course.duration,
        description: course.description,
        modules: course.modules ? JSON.parse(course.modules) : []
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "instructor" } },
          { field: { Name: "duration" } },
          { field: { Name: "subject" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "modules" } }
        ]
      };
      
      const response = await apperClient.getRecordById('course', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Course not found');
      }
      
      return {
        id: response.data.Id.toString(),
        title: response.data.title || response.data.Name,
        subject: response.data.subject,
        difficulty: response.data.difficulty,
        instructor: response.data.instructor,
        duration: response.data.duration,
        description: response.data.description,
        modules: response.data.modules ? JSON.parse(response.data.modules) : []
      };
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  },

  async create(courseData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: courseData.title,
          title: courseData.title,
          description: courseData.description,
          instructor: courseData.instructor,
          duration: courseData.duration,
          subject: courseData.subject,
          difficulty: courseData.difficulty,
          modules: JSON.stringify(courseData.modules || [])
        }]
      };
      
      const response = await apperClient.createRecord('course', params);
      
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
          const newCourse = successfulRecords[0].data;
          return {
            id: newCourse.Id.toString(),
            title: newCourse.title || newCourse.Name,
            subject: newCourse.subject,
            difficulty: newCourse.difficulty,
            instructor: newCourse.instructor,
            duration: newCourse.duration,
            description: newCourse.description,
            modules: newCourse.modules ? JSON.parse(newCourse.modules) : []
          };
        }
      }
      
      throw new Error('Failed to create course');
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  async update(id, courseData) {
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
          Name: courseData.title,
          title: courseData.title,
          description: courseData.description,
          instructor: courseData.instructor,
          duration: courseData.duration,
          subject: courseData.subject,
          difficulty: courseData.difficulty,
          modules: JSON.stringify(courseData.modules || [])
        }]
      };
      
      const response = await apperClient.updateRecord('course', params);
      
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
          const updatedCourse = successfulUpdates[0].data;
          return {
            id: updatedCourse.Id.toString(),
            title: updatedCourse.title || updatedCourse.Name,
            subject: updatedCourse.subject,
            difficulty: updatedCourse.difficulty,
            instructor: updatedCourse.instructor,
            duration: updatedCourse.duration,
            description: updatedCourse.description,
            modules: updatedCourse.modules ? JSON.parse(updatedCourse.modules) : []
          };
        }
      }
      
      throw new Error('Failed to update course');
    } catch (error) {
      console.error("Error updating course:", error);
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
      
      const response = await apperClient.deleteRecord('course', params);
      
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
      console.error("Error deleting course:", error);
      throw error;
    }
  }
};