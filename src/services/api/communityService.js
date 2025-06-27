import { discussionsData, threadRepliesData } from '@/services/mockData/discussions';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let lastId = Math.max(...discussionsData.map(d => d.Id)) + 1;
let lastReplyId = Math.max(...threadRepliesData.map(r => r.Id)) + 1;

export const communityService = {
  async getAll() {
    await delay(300);
    return [...discussionsData];
  },
async getById(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    await delay(200);
    const discussion = discussionsData.find(d => d.Id === id);
    if (!discussion) {
      throw new Error('Discussion not found');
    }
    // Increment views
    const index = discussionsData.findIndex(d => d.Id === id);
    if (index !== -1) {
      discussionsData[index].views += 1;
    }
    return { ...discussion };
  },

async create(discussionData) {
    await delay(400);
    const newDiscussion = {
      ...discussionData,
      Id: lastId++,
      createdAt: new Date().toISOString(),
      replies: 0,
      views: 0
    };
    discussionsData.push(newDiscussion);
    return { ...newDiscussion };
  },

async update(Id, discussionData) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    await delay(300);
    const index = discussionsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Discussion not found');
    }
    discussionsData[index] = { ...discussionsData[index], ...discussionData };
    return { ...discussionsData[index] };
  },

async delete(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid discussion ID');
    }
    await delay(200);
    const index = discussionsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Discussion not found');
    }
    discussionsData.splice(index, 1);
    return true;
  },

  // Thread replies management
  async getThreadReplies(threadId) {
    const id = parseInt(threadId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid thread ID');
    }
    await delay(200);
    const replies = threadRepliesData.filter(reply => reply.threadId === id);
    return [...replies];
  },

  async addReply(replyData) {
    await delay(300);
    const newReply = {
      ...replyData,
      Id: lastReplyId++,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    threadRepliesData.push(newReply);
    
    // Update discussion reply count
    const discussionIndex = discussionsData.findIndex(d => d.Id === newReply.threadId);
    if (discussionIndex !== -1) {
      discussionsData[discussionIndex].replies += 1;
    }
    
    return { ...newReply };
  },

  async updateReply(Id, replyData) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    await delay(250);
    const index = threadRepliesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Reply not found');
    }
    threadRepliesData[index] = { ...threadRepliesData[index], ...replyData };
    return { ...threadRepliesData[index] };
  },

  async deleteReply(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    await delay(200);
    const index = threadRepliesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Reply not found');
    }
    
    const reply = threadRepliesData[index];
    threadRepliesData.splice(index, 1);
    
    // Update discussion reply count
    const discussionIndex = discussionsData.findIndex(d => d.Id === reply.threadId);
    if (discussionIndex !== -1) {
      discussionsData[discussionIndex].replies -= 1;
    }
    
    return true;
  },

  async likeReply(Id) {
    const id = parseInt(Id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid reply ID');
    }
    await delay(150);
    const index = threadRepliesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Reply not found');
    }
    threadRepliesData[index].likes += 1;
    return { ...threadRepliesData[index] };
  }
};