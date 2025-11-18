import dbConnect from '@/server/utils/dbConnect';
import { getAllWaitlistStudent } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return getAllWaitlistStudent(req);
}
