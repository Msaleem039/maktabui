import dbConnect from '@/server/utils/dbConnect';
import { getTeacherDetail } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return getTeacherDetail(req);
}
