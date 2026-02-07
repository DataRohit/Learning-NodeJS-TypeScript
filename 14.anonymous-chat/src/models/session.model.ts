import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  code: string;
  ownerId: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Session = mongoose.model<ISession>("Session", SessionSchema);

export interface IMessage {
  sessionCode: string;
  senderId: string;
  text: string;
  timestamp: Date;
  expiresAt: Date;
}

const MessageSchema: Schema = new Schema({
  sessionCode: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
