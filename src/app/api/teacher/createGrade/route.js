import dbConnect from '@/server/utils/dbConnect';
import { createGrade } from '@/server/controllers/GradeController';

dbConnect();

export async function POST(req) {
    return createGrade(req);
}
