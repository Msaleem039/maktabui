import dbConnect from '@/server/utils/dbConnect';
import { createTeacher } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return createTeacher(req);
}
