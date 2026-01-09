import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function PUT(req) {
  try {
    // Create Supabase client at runtime
    const supabase = getSupabaseServerClient();

    // Get the uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const bucket = "maktab-system";

    // Convert file to buffer (Supabase needs a buffer for Node)
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false, // set to true if you want to overwrite
      });

    if (error) throw error;

    // Get public URL
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