export interface Player {
  id: string;
  nombre: string;
  apellidos: string;
  dorsal: number;
  fechaNacimiento: string; // Format: DD/MM/AAAA
  posicion: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  pieDominante?: string;
  nacionalidad?: string;
  lugarNacimiento?: string;
  telefono?: string;
  email?: string;
}

export interface MetricEvaluation {
  tecnica: number; // 1 to 5
  tactica: number; // 1 to 5
  condicional: number; // 1 to 5
  fecha: string;
  observaciones?: string;
}

export type TabType = 'plantilla' | 'evaluaciones';
