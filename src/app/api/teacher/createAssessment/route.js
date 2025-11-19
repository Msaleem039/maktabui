import { createAssessment } from '@/server/controllers/AssessmentsController';
import dbConnect from '@/server/utils/dbConnect';

dbConnect();

export async function POST(req) {
    return createAssessment(req);
}
