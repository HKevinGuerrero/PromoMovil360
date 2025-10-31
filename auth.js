// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ Configuración Supabase (tu proyecto)
const SUPABASE_URL = "https://xjzkernuaqyfsfeowrsl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqemtlcm51YXF5ZnNmZW93cnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjE5OTIsImV4cCI6MjA3NzQzNzk5Mn0.MSgTsMXHQ847X0NKl8Ly05kFczqwn9XC01dzsZ_cY-8";

// ✅ Crear el cliente global de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Proteger rutas (por ejemplo, dashboard)
export async function requireAuth(redirectTo = "login.html") {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = redirectTo;
  return session;
}

// ✅ Obtener usuario actual
export async function currentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ✅ Cerrar sesión
export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}
