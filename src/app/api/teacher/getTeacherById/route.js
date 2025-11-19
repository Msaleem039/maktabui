import dbConnect from '@/server/utils/dbConnect';
import { getTeacherById } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return getTeacherById(req);
}
