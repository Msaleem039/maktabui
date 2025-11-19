import dbConnect from '@/server/utils/dbConnect';
import { markAttendance } from '@/server/controllers/AttendanceController';

dbConnect();

export async function POST(req) {
    return markAttendance(req);
}
