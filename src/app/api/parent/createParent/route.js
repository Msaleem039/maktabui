import dbConnect from '@/server/utils/dbConnect';
import { createParent } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return createParent(req);
}
