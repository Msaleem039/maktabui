import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("maktab-system")
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("maktab-system")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: data.publicUrl,
        size: file.size,
        type: file.type,
        fileName,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
