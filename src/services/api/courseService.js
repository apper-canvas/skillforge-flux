import { coursesData } from '@/services/mockData/courses';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...coursesData];
  },

  async getById(id) {
    await delay(200);
    const course = coursesData.find(c => c.id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      id: Math.max(...coursesData.map(c => parseInt(c.id))) + 1
    };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(300);
    const index = coursesData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    coursesData[index] = { ...coursesData[index], ...courseData };
    return { ...coursesData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = coursesData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    coursesData.splice(index, 1);
    return true;
  }
};