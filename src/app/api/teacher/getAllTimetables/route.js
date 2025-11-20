import dbConnect from '@/server/utils/dbConnect';
import { getAllTimetables } from '@/server/controllers/TimeTableController';

dbConnect();

export async function POST(req) {
    return getAllTimetables(req);
}
