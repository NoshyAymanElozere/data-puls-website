import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: { type: String },
    title: { type: String, required: true },
    subtitle: { type: String },
    coverImage: { type: String },
    author: {
      name: { type: String },
      avatarUrl: { type: String }
    },
    readTime: { type: String },
    publishedAt: { type: Date },
    content: {
      sections: [mongoose.Schema.Types.Mixed]
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
