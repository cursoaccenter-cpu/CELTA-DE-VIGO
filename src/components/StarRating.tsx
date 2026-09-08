import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label: string;
  description?: string;
  value: number;
  onChange: (rating: number) => void;
  idPrefix: string;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Nivel Inicial / Necesita Refuerzo',
  2: 'En Desarrollo / Regular',
  3: 'Competente / Buen Desempeño',
  4: 'Destacado / Alto Rendimiento',
  5: 'Sobresaliente / Nivel Élite'
};

export function StarRating({
  label,
  description,
  value,
  onChange,
  idPrefix
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeRating = hoverValue !== null ? hoverValue : value;

  return (
    <div
      id={`${idPrefix}-container`}
      className="p-4 sm:p-5 rounded-xl bg-white border-2 border-[#E5252A] transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E5252A]" />
            <h4
              id={`${idPrefix}-title`}
              className="text-base sm:text-lg font-bold tracking-wide text-slate-900 uppercase"
            >
              {label}
            </h4>
          </div>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5 ml-4.5">{description}</p>
          )}
        </div>

        {/* Rating Numeric Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#FEF2F2] border border-[#E5252A]/30 px-3 py-1 rounded-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Puntuación:
          </span>
          <span
            id={`${idPrefix}-score-display`}
            className="text-sm font-extrabold text-[#E5252A]"
          >
            {value > 0 ? `${value}/5` : 'Sin calificar'}
          </span>
        </div>
      </div>

      {/* Interactive 5 Stars */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div
          id={`${idPrefix}-stars-group`}
          className="flex items-center gap-1.5 sm:gap-2"
          onMouseLeave={() => setHoverValue(null)}
          role="radiogroup"
          aria-label={`Calificación para ${label}`}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeRating;
            return (
              <button
                key={star}
                id={`${idPrefix}-star-${star}`}
                type="button"
                onClick={() => onChange(star)}
                onMouseEnter={() => setHoverValue(star)}
                className="group relative p-2 rounded-lg transition-transform hover:scale-115 focus:outline-none focus:ring-2 focus:ring-[#E5252A] focus:ring-offset-2 touch-manipulation cursor-pointer"
                aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                role="radio"
                aria-checked={value === star}
              >
                <Star
                  size={32}
                  className={`transition-all duration-150 ${
                    isFilled
                      ? 'fill-[#E5252A] text-[#E5252A] drop-shadow-sm'
                      : 'fill-transparent text-[#E5252A]/30 stroke-[#E5252A]'
                  }`}
                  strokeWidth={2}
                />
                {/* Numeric hint underneath star on hover */}
                <span className="sr-only">{star} estrellas</span>
              </button>
            );
          })}
        </div>

        {/* Circular Fast-Select Buttons (1 to 5) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            return (
              <button
                key={num}
                id={`${idPrefix}-pill-${num}`}
                type="button"
                onClick={() => onChange(num)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                  isSelected
                    ? 'bg-[#E5252A] text-white border-[#E5252A] shadow-sm'
                    : 'bg-white text-slate-600 border-[#E5252A]/40 hover:border-[#E5252A] hover:text-[#E5252A]'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description of current score */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="italic">
          {value > 0
            ? RATING_DESCRIPTIONS[value]
            : 'Selecciona una puntuación del 1 al 5'}
        </span>
        <span className="text-[11px] text-[#E5252A] font-medium hidden sm:inline">
          Escala deportiva 1-5
        </span>
      </div>
    </div>
  );
}
