// models/analyticsSnapshot.js (modified)
import mongooseInstance from "../config/mongooseInstance.js";

const AnalyticsSnapshotSchema = new mongooseInstance.Schema({
  bucket: { type: String, enum: ['hourly','daily'], required: true },
  ts: { type: Date, required: true },          // bucket start time (e.g., 2025-12-10T09:00:00Z)
  metrics: { type: Object, required: true },   // small object {activeUsers:10, sessions:20, pageviews:200}
  topPages: [{ path: String, views: Number }], // top N (N small, e.g. 5 or 10)
});
// TTL index example for hourly: keep 30 days of hourly data
AnalyticsSnapshotSchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days
module.exports = mongooseInstance.model('AnalyticsSnapshot', AnalyticsSnapshotSchema);
