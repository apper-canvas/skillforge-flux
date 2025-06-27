const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const profileService = {
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
          { field: { Name: "Owner" } },
          { field: { Name: "user_id" } },
          { field: { Name: "biography" } },
          { field: { Name: "interests" } },
          { field: { Name: "skills" } },
          { field: { Name: "address" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "coursesCompleted" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('profile', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  },

  async getById(id) {
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
          { field: { Name: "Owner" } },
          { field: { Name: "user_id" } },
          { field: { Name: "biography" } },
          { field: { Name: "interests" } },
          { field: { Name: "skills" } },
          { field: { Name: "address" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "coursesCompleted" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('profile', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching profile with ID ${id}:`, error);
      throw error;
    }
  },

  async create(profileData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
const updateableData = {
        Name: profileData.Name || '',
        Tags: profileData.Tags || '',
        Owner: profileData.Owner || null,
        user_id: profileData.user_id || null,
        biography: profileData.biography || '',
        interests: profileData.interests || '',
        skills: profileData.skills || '',
        address: profileData.address || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
        coursesCompleted: profileData.coursesCompleted || ''
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('profile', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} profiles:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create profile');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async update(id, profileData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
const updateableData = {
        Id: parseInt(id),
        Name: profileData.Name || '',
        Tags: profileData.Tags || '',
        Owner: profileData.Owner || null,
        user_id: profileData.user_id || null,
        biography: profileData.biography || '',
        interests: profileData.interests || '',
        skills: profileData.skills || '',
        address: profileData.address || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
        coursesCompleted: profileData.coursesCompleted || ''
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('profile', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} profiles:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update profile');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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

      const response = await apperClient.deleteRecord('profile', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} profiles:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete profile');
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
};

export default profileService;