import dbConnect from '@/server/utils/dbConnect';
import { getAllWaitlistParents } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return getAllWaitlistParents(req);
}
