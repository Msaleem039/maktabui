import dbConnect from '@/server/utils/dbConnect';
import { updateTeacher } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return updateTeacher(req);
}
