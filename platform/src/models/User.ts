import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  githubId: string;
  githubUsername: string;
  avatarUrl: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;