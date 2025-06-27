import { discussionsData } from '@/services/mockData/discussions';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityService = {
  async getAll() {
    await delay(300);
    return [...discussionsData];
  },

  async getById(id) {
    await delay(200);
    const discussion = discussionsData.find(d => d.id === id);
    if (!discussion) {
      throw new Error('Discussion not found');
    }
    return { ...discussion };
  },

  async create(discussionData) {
    await delay(400);
    const newDiscussion = {
      ...discussionData,
      id: Math.max(...discussionsData.map(d => d.id)) + 1,
      createdAt: new Date().toISOString(),
      replies: 0,
      views: 0
    };
    discussionsData.push(newDiscussion);
    return { ...newDiscussion };
  },

  async update(id, discussionData) {
    await delay(300);
    const index = discussionsData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Discussion not found');
    }
    discussionsData[index] = { ...discussionsData[index], ...discussionData };
    return { ...discussionsData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = discussionsData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Discussion not found');
    }
    discussionsData.splice(index, 1);
    return true;
  }
};