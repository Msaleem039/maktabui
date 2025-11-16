import dbConnect from '@/server/utils/dbConnect';
import { getTeachersName } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return getTeachersName(req);
}
