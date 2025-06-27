import { progressData } from '@/services/mockData/progress';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getAll() {
    await delay(200);
    return [...progressData];
  },

  async getById(courseId) {
    await delay(150);
    const progress = progressData.find(p => p.courseId === courseId);
    if (!progress) {
      throw new Error('Progress not found');
    }
    return { ...progress };
  },

  async create(progressItem) {
    await delay(300);
    const newProgress = {
      ...progressItem,
      id: Math.max(...progressData.map(p => p.id), 0) + 1
    };
    progressData.push(newProgress);
    return { ...newProgress };
  },

  async update(courseId, progressItem) {
    await delay(250);
    const index = progressData.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    progressData[index] = { ...progressData[index], ...progressItem };
    return { ...progressData[index] };
  },

  async delete(courseId) {
    await delay(200);
    const index = progressData.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    progressData.splice(index, 1);
    return true;
  }
};