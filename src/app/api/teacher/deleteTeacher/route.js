import dbConnect from '@/server/utils/dbConnect';
import { deleteTeacher } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return deleteTeacher(req);
}
