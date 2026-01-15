import mongoose, { Document, Schema } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  serverId: mongoose.Types.ObjectId;
  type: 'text' | 'voice';
  createdAt: Date;
}

const channelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  serverId: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IChannel>('Channel', channelSchema);
