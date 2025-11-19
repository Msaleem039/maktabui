import dbConnect from '@/server/utils/dbConnect';
import { createTimetable } from '@/server/controllers/TimeTableController';

dbConnect();

export async function POST(req) {
    return createTimetable(req);
}
