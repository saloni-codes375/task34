import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A user reference is required']
    }
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)
export default Post
