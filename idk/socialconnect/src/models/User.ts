import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  likedPosts: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
