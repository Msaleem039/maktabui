import dbConnect from '@/server/utils/dbConnect';
import { createStudent } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return createStudent(req);
}
