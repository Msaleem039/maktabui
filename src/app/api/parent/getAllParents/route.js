import dbConnect from '@/server/utils/dbConnect';
import { getAllParents } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return getAllParents(req);
}
