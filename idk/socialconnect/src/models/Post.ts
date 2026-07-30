import mongoose, { Schema, Document } from "mongoose";

export interface IPostDoc extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  image: string;
  likes: mongoose.Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDoc>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    image: { type: String, default: "" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ tags: 1 });

export default mongoose.models.Post || mongoose.model<IPostDoc>("Post", PostSchema);
