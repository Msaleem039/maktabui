import dbConnect from '@/server/utils/dbConnect';
import { getAllTeachers } from '@/server/controllers/TeacherController';

dbConnect();

export async function POST(req) {
    return getAllTeachers(req);
}
