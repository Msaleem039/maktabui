import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PUT(req) {
  try {
    const supabase = getSupabaseServerClient();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const bucket = "maktab-system";

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        fileName,
        url: data.publicUrl,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}