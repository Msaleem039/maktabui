import dbConnect from '@/server/utils/dbConnect';
import { getAllClassesName } from '@/server/controllers/ClassController';

dbConnect();

export async function POST(req) {
    return getAllClassesName(req);
}
