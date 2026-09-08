import { createClient } from '@supabase/supabase-js';
import { MetricEvaluation } from '../types';

// Sanitize URL in case user inputs REST endpoint or base URL
const RAW_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kojysdnrtlugijzqslwo.supabase.co';
export const SUPABASE_URL = RAW_URL.replace(/\/rest\/v1\/?$/, '');
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvanlzZG5ydGx1Z2lqenFzbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODI3OTksImV4cCI6MjEwNDQ1ODc5OX0.KGT2DvIhwCSio3MduTmmDb7_D0_QzqN6OKsSQGr9oSY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseEvaluationRow {
  id?: string;
  player_id: string;
  tecnica: number;
  tactica: number;
  condicional: number;
  fecha: string;
  observaciones?: string;
  updated_at?: string;
}

export interface SupabaseSyncStatus {
  connected: boolean;
  tableReady: boolean;
  lastSync?: string;
  errorMessage?: string;
}

export const SUPABASE_ADD_TELEFONO_SQL = `-- ============================================================
-- SQL PARA AÑADIR EL CAMPO NUMERO DE TELEFONO EN SUPABASE
-- Ejecuta este comando en SQL Editor de tu proyecto Supabase:
-- ============================================================

ALTER TABLE public.jugadores 
ADD COLUMN IF NOT EXISTS telefono TEXT DEFAULT '';

-- Actualizar teléfonos de los jugadores oficiales (opcional):
UPDATE public.jugadores SET telefono = '+34 686 10 10 10' WHERE id = 'aspas-10';
UPDATE public.jugadores SET telefono = '+34 670 08 08 08' WHERE id = 'beltran-8';
UPDATE public.jugadores SET telefono = '+34 654 03 03 03' WHERE id = 'mingueza-3';
UPDATE public.jugadores SET telefono = '+34 632 02 02 02' WHERE id = 'starfelt-2';
UPDATE public.jugadores SET telefono = '+34 621 17 17 17' WHERE id = 'bamba-17';
UPDATE public.jugadores SET telefono = '+34 645 09 09 09' WHERE id = 'douvikas-9';
UPDATE public.jugadores SET telefono = '+34 699 19 19 19' WHERE id = 'swedberg-19';
UPDATE public.jugadores SET telefono = '+34 611 30 30 30' WHERE id = 'alvarez-30';
UPDATE public.jugadores SET telefono = '+34 688 25 25 25' WHERE id = 'guaita-25';
UPDATE public.jugadores SET telefono = '+34 633 22 22 22' WHERE id = 'manquillo-22';
`;

export const SUPABASE_ADD_EMAIL_SQL = `-- ============================================================
-- SQL PARA AÑADIR EL CAMPO CORREO ELECTRÓNICO (EMAIL) EN SUPABASE
-- Ejecuta este comando en SQL Editor de tu proyecto Supabase:
-- ============================================================

ALTER TABLE public.jugadores 
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- Actualizar correos electrónicos de los jugadores oficiales (opcional):
UPDATE public.jugadores SET email = 'iago.aspas@rccelta.es' WHERE id = 'aspas-10';
UPDATE public.jugadores SET email = 'fran.beltran@rccelta.es' WHERE id = 'beltran-8';
UPDATE public.jugadores SET email = 'oscar.mingueza@rccelta.es' WHERE id = 'mingueza-3';
UPDATE public.jugadores SET email = 'carl.starfelt@rccelta.es' WHERE id = 'starfelt-2';
UPDATE public.jugadores SET email = 'jonathan.bamba@rccelta.es' WHERE id = 'bamba-17';
UPDATE public.jugadores SET email = 'anastasios.douvikas@rccelta.es' WHERE id = 'douvikas-9';
UPDATE public.jugadores SET email = 'williot.swedberg@rccelta.es' WHERE id = 'swedberg-19';
UPDATE public.jugadores SET email = 'hugo.alvarez@rccelta.es' WHERE id = 'alvarez-30';
UPDATE public.jugadores SET email = 'vicente.guaita@rccelta.es' WHERE id = 'guaita-25';
UPDATE public.jugadores SET email = 'javier.manquillo@rccelta.es' WHERE id = 'manquillo-22';
`;

export const SUPABASE_JUGADORES_SQL = `-- 1. Crear tabla de jugadores del Real Club Celta de Vigo
CREATE TABLE IF NOT EXISTS public.jugadores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dorsal INTEGER NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  posicion TEXT NOT NULL,
  pie_dominante TEXT DEFAULT 'Derecho',
  nacionalidad TEXT DEFAULT 'España',
  lugar_nacimiento TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.jugadores ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso público (con clave anon)
DROP POLICY IF EXISTS "Lectura publica jugadores" ON public.jugadores;
CREATE POLICY "Lectura publica jugadores"
  ON public.jugadores FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Gestion publica jugadores" ON public.jugadores;
CREATE POLICY "Gestion publica jugadores"
  ON public.jugadores FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Insertar los 10 jugadores oficiales del RC Celta
INSERT INTO public.jugadores (id, nombre, apellidos, dorsal, fecha_nacimiento, posicion, pie_dominante, nacionalidad, lugar_nacimiento, telefono, email)
VALUES
  ('aspas-10', 'Iago', 'Aspas Juncal', 10, '01/08/1987', 'Delantero', 'Izquierdo', 'España', 'Moaña, Pontevedra', '+34 686 10 10 10', 'iago.aspas@rccelta.es'),
  ('beltran-8', 'Fran', 'Beltrán Peinado', 8, '03/02/1999', 'Centrocampista', 'Derecho', 'España', 'Madrid', '+34 670 08 08 08', 'fran.beltran@rccelta.es'),
  ('mingueza-3', 'Óscar', 'Mingueza García', 3, '13/05/1999', 'Defensa', 'Derecho', 'España', 'Santa Perpètua de Mogoda', '+34 654 03 03 03', 'oscar.mingueza@rccelta.es'),
  ('starfelt-2', 'Carl', 'Starfelt', 2, '01/06/1995', 'Defensa', 'Derecho', 'Suecia', 'Estocolmo', '+34 632 02 02 02', 'carl.starfelt@rccelta.es'),
  ('bamba-17', 'Jonathan', 'Bamba', 17, '26/03/1996', 'Delantero', 'Derecho', 'Costa de Marfil', 'Alfortville, Francia', '+34 621 17 17 17', 'jonathan.bamba@rccelta.es'),
  ('douvikas-9', 'Anastasios', 'Douvikas', 9, '02/08/1999', 'Delantero', 'Derecho', 'Grecia', 'Atenas', '+34 645 09 09 09', 'anastasios.douvikas@rccelta.es'),
  ('swedberg-19', 'Williot', 'Swedberg', 19, '01/02/2004', 'Centrocampista', 'Derecho', 'Suecia', 'Estocolmo', '+34 699 19 19 19', 'williot.swedberg@rccelta.es'),
  ('alvarez-30', 'Hugo', 'Álvarez Antúnez', 30, '02/07/2003', 'Centrocampista', 'Derecho', 'España', 'Ourense', '+34 611 30 30 30', 'hugo.alvarez@rccelta.es'),
  ('guaita-25', 'Vicente', 'Guaita Panadero', 25, '10/01/1987', 'Portero', 'Derecho', 'España', 'Torrent, Valencia', '+34 688 25 25 25', 'vicente.guaita@rccelta.es'),
  ('manquillo-22', 'Javier', 'Manquillo Gaitán', 22, '05/05/1994', 'Defensa', 'Derecho', 'España', 'Madrid', '+34 633 22 22 22', 'javier.manquillo@rccelta.es')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellidos = EXCLUDED.apellidos,
  dorsal = EXCLUDED.dorsal,
  fecha_nacimiento = EXCLUDED.fecha_nacimiento,
  posicion = EXCLUDED.posicion,
  pie_dominante = EXCLUDED.pie_dominante,
  nacionalidad = EXCLUDED.nacionalidad,
  lugar_nacimiento = EXCLUDED.lugar_nacimiento,
  telefono = EXCLUDED.telefono,
  email = EXCLUDED.email;
`;

export const SUPABASE_SETUP_SQL = `-- ============================================================
-- SCRIPT COMPLETO SUPABASE: JUGADORES + EVALUACIONES
-- ============================================================

${SUPABASE_JUGADORES_SQL}

-- ============================================================
-- TABLA DE EVALUACIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evaluaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT UNIQUE NOT NULL REFERENCES public.jugadores(id) ON DELETE CASCADE,
  tecnica INTEGER NOT NULL CHECK (tecnica >= 1 AND tecnica <= 5),
  tactica INTEGER NOT NULL CHECK (tactica >= 1 AND tactica <= 5),
  condicional INTEGER NOT NULL CHECK (condicional >= 1 AND condicional <= 5),
  fecha TEXT NOT NULL,
  observaciones TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica evaluaciones" ON public.evaluaciones;
CREATE POLICY "Lectura publica evaluaciones"
  ON public.evaluaciones FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Guardado publico evaluaciones" ON public.evaluaciones;
CREATE POLICY "Guardado publico evaluaciones"
  ON public.evaluaciones FOR ALL
  USING (true)
  WITH CHECK (true);
`;

/**
 * Checks if the Supabase project is reachable and if the `evaluaciones` table exists.
 */
export async function checkSupabaseStatus(): Promise<SupabaseSyncStatus> {
  try {
    const { data, error } = await supabase
      .from('evaluaciones')
      .select('player_id')
      .limit(1);

    if (error) {
      // PGRST205 or 404 indicates table does not exist yet in schema cache
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('schema cache')
      ) {
        return {
          connected: true,
          tableReady: false,
          errorMessage: 'Tabla "evaluaciones" aún no creada en Supabase.',
        };
      }
      return {
        connected: false,
        tableReady: false,
        errorMessage: error.message,
      };
    }

    return {
      connected: true,
      tableReady: true,
      lastSync: new Date().toLocaleTimeString(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido de conexión';
    return {
      connected: false,
      tableReady: false,
      errorMessage: msg,
    };
  }
}

/**
 * Fetches all saved evaluations from Supabase.
 */
export async function fetchEvaluationsFromSupabase(): Promise<{
  evaluations: Record<string, MetricEvaluation> | null;
  tableReady: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('evaluaciones')
      .select('*');

    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('schema cache')
      ) {
        return { evaluations: null, tableReady: false, error: 'Tabla no inicializada' };
      }
      return { evaluations: null, tableReady: false, error: error.message };
    }

    if (!data) {
      return { evaluations: {}, tableReady: true };
    }

    const evalsMap: Record<string, MetricEvaluation> = {};
    for (const row of data as SupabaseEvaluationRow[]) {
      if (row.player_id) {
        evalsMap[row.player_id] = {
          tecnica: row.tecnica,
          tactica: row.tactica,
          condicional: row.condicional,
          fecha: row.fecha,
          observaciones: row.observaciones || '',
        };
      }
    }

    return { evaluations: evalsMap, tableReady: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de consulta';
    return { evaluations: null, tableReady: false, error: msg };
  }
}

/**
 * Saves or updates a player's evaluation in Supabase.
 */
export async function saveEvaluationToSupabase(
  playerId: string,
  evaluation: MetricEvaluation
): Promise<{ success: boolean; error?: string; tableReady: boolean }> {
  try {
    const row: SupabaseEvaluationRow = {
      player_id: playerId,
      tecnica: evaluation.tecnica,
      tactica: evaluation.tactica,
      condicional: evaluation.condicional,
      fecha: evaluation.fecha,
      observaciones: evaluation.observaciones || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('evaluaciones')
      .upsert(row, { onConflict: 'player_id' });

    if (error) {
      const isMissingTable =
        error.code === 'PGRST205' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('schema cache');

      return {
        success: false,
        tableReady: !isMissingTable,
        error: error.message,
      };
    }

    return { success: true, tableReady: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al guardar en Supabase';
    return { success: false, tableReady: false, error: msg };
  }
}

/**
 * Fetches players from Supabase `public.jugadores` if available.
 */
export async function fetchPlayersFromSupabase(): Promise<import('../types').Player[] | null> {
  try {
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .order('dorsal', { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      apellidos: row.apellidos,
      dorsal: row.dorsal,
      fechaNacimiento: row.fecha_nacimiento,
      posicion: row.posicion as any,
      pieDominante: row.pie_dominante,
      nacionalidad: row.nacionalidad,
      lugarNacimiento: row.lugar_nacimiento,
      telefono: row.telefono || '',
      email: row.email || '',
    }));
  } catch {
    return null;
  }
}

/**
 * Upserts a player into Supabase `public.jugadores`.
 * Gracefully handles database tables where new columns (email, telefono) might not exist yet.
 */
export async function upsertPlayerInSupabase(player: import('../types').Player): Promise<{ success: boolean; error?: string }> {
  try {
    const fullRow = {
      id: player.id,
      nombre: player.nombre,
      apellidos: player.apellidos || '',
      dorsal: player.dorsal,
      fecha_nacimiento: player.fechaNacimiento,
      posicion: player.posicion,
      pie_dominante: player.pieDominante || 'Derecho',
      nacionalidad: player.nacionalidad || 'España',
      lugar_nacimiento: player.lugarNacimiento || '',
      telefono: player.telefono || '',
      email: player.email || '',
    };

    // 1. First attempt with all columns
    const { error } = await supabase
      .from('jugadores')
      .upsert(fullRow, { onConflict: 'id' });

    if (!error) {
      return { success: true };
    }

    // 2. If table doesn't have email column yet (PGRST204 or column does not exist)
    if (error.message?.includes('email') || error.code === '42703' || error.code === 'PGRST204') {
      const rowNoEmail: Record<string, any> = { ...fullRow };
      delete rowNoEmail.email;

      const res2 = await supabase
        .from('jugadores')
        .upsert(rowNoEmail, { onConflict: 'id' });

      if (!res2.error) {
        return { success: true };
      }

      // If it also fails on telefono
      if (res2.error.message?.includes('telefono') || res2.error.code === '42703') {
        delete rowNoEmail.telefono;
        const res3 = await supabase
          .from('jugadores')
          .upsert(rowNoEmail, { onConflict: 'id' });

        if (!res3.error) {
          return { success: true };
        }
        return { success: false, error: res3.error.message };
      }

      return { success: false, error: res2.error.message };
    }

    return { success: false, error: error.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al guardar jugador';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a player from Supabase `public.jugadores` and cascades to `public.evaluaciones`.
 */
export async function deletePlayerInSupabase(playerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete evaluation first in case foreign key cascade isn't set up
    await supabase.from('evaluaciones').delete().eq('player_id', playerId);

    const { error } = await supabase
      .from('jugadores')
      .delete()
      .eq('id', playerId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al eliminar jugador';
    return { success: false, error: msg };
  }
}


