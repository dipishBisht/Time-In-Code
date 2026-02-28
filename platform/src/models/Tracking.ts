import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITracking extends Document {
  githubId: string;
  date: string;
  totalSeconds: number;
  languages: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;

  formatDuration(): string;
}

const TrackingSchema = new Schema<ITracking>(
  {
    githubId: {
      type: String,
      required: [true, "GitHub ID is required"],
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
      index: true,
    },
    totalSeconds: {
      type: Number,
      required: [true, "Total seconds is required"],
      min: [0, "Total seconds cannot be negative"],
      default: 0,
    },
    languages: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for githubId + date
TrackingSchema.index({ githubId: 1, date: 1 }, { unique: true });

// Index for sorting by date
TrackingSchema.index({ githubId: 1, date: -1 });

// JSON transformation
TrackingSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    if (ret.languages instanceof Map) {
      ret.languages = Object.fromEntries(ret.languages);
    }
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Static method: Merge tracking data
TrackingSchema.statics.mergeTrackingData = async function (
  githubId: string,
  date: string,
  totalSeconds: number,
  languages: Record<string, number>
) {
  const existing = await this.findOne({ githubId, date });

  if (existing) {
    // Merge: add new seconds to existing
    const updatedLanguages = new Map<string, number>(
      existing.languages as Map<string, number>
    );

    for (const [lang, seconds] of Object.entries(languages)) {
      const current = updatedLanguages.get(lang) || 0;
      updatedLanguages.set(lang, Math.max(0, current + seconds));
    }

    existing.totalSeconds += totalSeconds;
    existing.languages = updatedLanguages;
    await existing.save();

    return existing;
  } else {
    // Create new document
    const languagesMap = new Map(Object.entries(languages));

    return await this.create({
      githubId,
      date,
      totalSeconds,
      languages: languagesMap,
    });
  }
};

// Instance method: Format duration
TrackingSchema.methods.formatDuration = function (): string {
  const hours = Math.floor(this.totalSeconds / 3600);
  const minutes = Math.floor((this.totalSeconds % 3600) / 60);
  const seconds = this.totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

// Model with static methods
interface TrackingModel extends Model<ITracking> {
  mergeTrackingData(
    githubId: string,
    date: string,
    totalSeconds: number,
    languages: Record<string, number>
  ): Promise<ITracking>;
}

const Tracking: TrackingModel =
  (mongoose.models.Tracking as TrackingModel) ||
  mongoose.model<ITracking, TrackingModel>("Tracking", TrackingSchema);

export default Tracking;