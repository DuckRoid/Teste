import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
  timestamp: Date;
  edited: boolean;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channelId: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IMessage>('Message', messageSchema);
