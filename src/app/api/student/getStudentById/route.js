import dbConnect from '@/server/utils/dbConnect';
import { getStudentById } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return getStudentById(req);
}
