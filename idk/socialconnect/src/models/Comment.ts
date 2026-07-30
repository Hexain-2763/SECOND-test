import mongoose, { Schema, Document } from "mongoose";

export interface ICommentDoc extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<ICommentDoc>({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.index({ post: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model<ICommentDoc>("Comment", CommentSchema);
