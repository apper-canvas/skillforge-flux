import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const enrollmentService = {
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
          { field: { Name: "course" } },
          { field: { Name: "user" } },
          { field: { Name: "enrollmentdate" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('enrollmentform', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(enrollment => ({
        id: enrollment.Id.toString(),
        name: enrollment.Name,
        course: enrollment.course,
        user: enrollment.user,
        enrollmentdate: enrollment.enrollmentdate
      }));
    } catch (error) {
      console.error("Error fetching enrollments:", error);
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
          { field: { Name: "course" } },
          { field: { Name: "user" } },
          { field: { Name: "enrollmentdate" } }
        ]
      };
      
      const response = await apperClient.getRecordById('enrollmentform', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Enrollment not found');
      }
      
      return {
        id: response.data.Id.toString(),
        name: response.data.Name,
        course: response.data.course,
        user: response.data.user,
        enrollmentdate: response.data.enrollmentdate
      };
    } catch (error) {
      console.error(`Error fetching enrollment with ID ${id}:`, error);
      throw error;
    }
  },

  async create(enrollmentData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: enrollmentData.name || `Enrollment-${Date.now()}`,
          course: parseInt(enrollmentData.course),
          user: parseInt(enrollmentData.user),
          enrollmentdate: enrollmentData.enrollmentdate
        }]
      };
      
      const response = await apperClient.createRecord('enrollmentform', params);
      
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
          const newEnrollment = successfulRecords[0].data;
          return {
            id: newEnrollment.Id.toString(),
            name: newEnrollment.Name,
            course: newEnrollment.course,
            user: newEnrollment.user,
            enrollmentdate: newEnrollment.enrollmentdate
          };
        }
      }
      
      throw new Error('Failed to create enrollment');
    } catch (error) {
      console.error("Error creating enrollment:", error);
      throw error;
    }
  },

  async update(id, enrollmentData) {
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
          Name: enrollmentData.name,
          course: parseInt(enrollmentData.course),
          user: parseInt(enrollmentData.user),
          enrollmentdate: enrollmentData.enrollmentdate
        }]
      };
      
      const response = await apperClient.updateRecord('enrollmentform', params);
      
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
          const updatedEnrollment = successfulUpdates[0].data;
          return {
            id: updatedEnrollment.Id.toString(),
            name: updatedEnrollment.Name,
            course: updatedEnrollment.course,
            user: updatedEnrollment.user,
            enrollmentdate: updatedEnrollment.enrollmentdate
          };
        }
      }
      
      throw new Error('Failed to update enrollment');
    } catch (error) {
      console.error("Error updating enrollment:", error);
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
      
      const response = await apperClient.deleteRecord('enrollmentform', params);
      
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
      console.error("Error deleting enrollment:", error);
      throw error;
    }
  }
};