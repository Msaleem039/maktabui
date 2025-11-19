import dbConnect from '@/server/utils/dbConnect';
import { getAllStudent } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return getAllStudent(req);
}
