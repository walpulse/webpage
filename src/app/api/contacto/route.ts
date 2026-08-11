import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_ORG = 200;
const MAX_MESSAGE = 5000;

type ContactBody = {
  nombre?: unknown;
  email?: unknown;
  organizacion?: unknown;
  mensaje?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const nombre = asTrimmedString(body.nombre);
  const email = asTrimmedString(body.email).toLowerCase();
  const organizacion = asTrimmedString(body.organizacion);
  const mensaje = asTrimmedString(body.mensaje);

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  if (
    nombre.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    organizacion.length > MAX_ORG ||
    mensaje.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc("submit_pagina_web_contacto", {
      p_nombre: nombre,
      p_email: email,
      p_organizacion: organizacion,
      p_mensaje: mensaje,
    });

    if (error) {
      console.error("submit_pagina_web_contacto failed", error.message);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data }, { status: 201 });
  } catch (err) {
    console.error("contacto route error", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
