import dbConnect from '@/server/utils/dbConnect';
import { getStudentNamesWithIds } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return getStudentNamesWithIds(req);
}
