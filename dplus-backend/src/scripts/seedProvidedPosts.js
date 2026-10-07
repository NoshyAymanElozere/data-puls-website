import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Post from '../models/Post.js';

dotenv.config();

const postsData = [
  {
    slug: 'llm-integration-patterns',
    category: 'الذكاء الاصطناعي',
    title: 'أنماط دمج نماذج اللغة الكبيرة',
    subtitle: 'دليل شامل لفهم كيفية دمج نماذج اللغة الكبيرة (LLMs) في تطبيقاتك للحصول على أفضل أداء وتجربة مستخدم.',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'فريق التحرير',
      avatarUrl: 'https://i.pravatar.cc/150?img=11'
    },
    readTime: '8 دقائق للقراءة',
    publishedAt: new Date('2026-08-10T20:38:19.117Z'),
    content: {
      sections: [
        {
          type: 'header',
          text: 'مقدمة عن دمج LLM'
        },
        {
          type: 'paragraph',
          text: 'النص التفصيلي للمقال يوضع هنا...'
        },
        {
          type: 'quote_card',
          text: 'نص الاقتباس يوضع هنا...',
          tag: 'هندسة التوجيه'
        }
      ]
    },
    createdAt: new Date('2026-08-10T20:38:19.125Z'),
    updatedAt: new Date('2026-08-10T20:38:19.125Z')
  },
  {
    slug: 'ai',
    category: 'الذكاء الاصطناعي',
    title: 'أنماط دمج نماذج اللغة الكبيرة',
    subtitle: 'دليل شامل لفهم كيفية دمج نماذج اللغة الكبيرة (LLMs) في تطبيقاتك للحصول على أفضل أداء وتجربة مستخدم.',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'فريق التحرير',
      avatarUrl: 'https://i.pravatar.cc/150?img=11'
    },
    readTime: '8 دقائق للقراءة',
    publishedAt: new Date('2026-08-10T20:48:00.916Z'),
    content: {
      sections: [
        {
          type: 'header',
          text: 'مقدمة عن دمج LLM'
        },
        {
          type: 'paragraph',
          text: 'النص التفصيلي للمقال يوضع هنا...'
        },
        {
          type: 'quote_card',
          text: 'نص الاقتباس يوضع هنا...',
          tag: 'هندسة التوجيه'
        }
      ]
    },
    createdAt: new Date('2026-08-10T20:48:00.920Z'),
    updatedAt: new Date('2026-08-10T20:48:00.920Z')
  }
];

const run = async () => {
  try {
    await connectDB();
    console.log('Clearing old posts to avoid duplication...');
    await Post.deleteMany({});

    console.log(`Seeding ${postsData.length} posts...`);
    const inserted = await Post.insertMany(postsData);
    console.log(`Successfully seeded ${inserted.length} posts into MongoDB!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding posts:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

run();
