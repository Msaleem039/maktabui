import dbConnect from '@/server/utils/dbConnect';
import { getAllClasses } from '@/server/controllers/ClassController';

dbConnect();

export async function POST(req) {
    return getAllClasses(req);
}
