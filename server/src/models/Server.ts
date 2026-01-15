import mongoose, { Document, Schema } from 'mongoose';

export interface IServer extends Document {
  name: string;
  icon: string;
  ownerId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  channels: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const serverSchema = new Schema<IServer>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  icon: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=00B894&color=fff&name='
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  channels: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set default icon with server name
serverSchema.pre('save', function(next) {
  if (!this.icon || this.icon === 'https://ui-avatars.com/api/?background=00B894&color=fff&name=') {
    this.icon = `https://ui-avatars.com/api/?background=00B894&color=fff&name=${this.name}`;
  }
  next();
});

export default mongoose.model<IServer>('Server', serverSchema);
