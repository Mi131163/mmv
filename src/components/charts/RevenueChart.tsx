import type { RevenueYear } from '../../types';

interface RevenueChartProps {
  data: RevenueYear[];
  height?: number;
}

export function RevenueChart({ data, height = 160 }: RevenueChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal =
    Math.max(...data.flatMap((d) => [d.confirmed + d.weighted, d.confirmed, d.weighted])) * 1.25 ||
    1;

  const barWidth = 22;
  const groupGap = 6;
  const yearGap = 20;
  const chartPaddingLeft = 44;
  const chartPaddingBottom = 32;
  const chartPaddingTop = 12;
  const chartHeight = height - chartPaddingBottom - chartPaddingTop;
  const totalWidth =
    chartPaddingLeft + data.length * (barWidth * 2 + groupGap + yearGap) + yearGap;

  const toH = (val: number) => Math.max((val / maxVal) * chartHeight, 0);

  const numTicks = 4;
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxVal * i) / numTicks);

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          width={totalWidth}
          height={height}
          style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'block' }}
        >
          {/* Grid lines + Y labels */}
          {yTicks.map((tick, i) => {
            const y = chartPaddingTop + chartHeight - (tick / maxVal) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={chartPaddingLeft}
                  y1={y}
                  x2={totalWidth - yearGap}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth={0.75}
                  strokeDasharray={i === 0 ? 'none' : '3,3'}
                />
                <text
                  x={chartPaddingLeft - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="var(--text-tertiary)"
                >
                  {tick === 0 ? '0' : `€${tick.toFixed(1)}M`}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const xBase = chartPaddingLeft + i * (barWidth * 2 + groupGap + yearGap);
            const confirmedH = toH(d.confirmed);
            const weightedH = toH(d.weighted);
            const confirmedY = chartPaddingTop + chartHeight - confirmedH;
            const weightedY = chartPaddingTop + chartHeight - weightedH;
            const centerX = xBase + barWidth + groupGap / 2;

            return (
              <g key={d.year}>
                {/* Confirmed bar */}
                {confirmedH > 0 && (
                  <rect
                    x={xBase}
                    y={confirmedY}
                    width={barWidth}
                    height={confirmedH}
                    rx={3}
                    fill="var(--accent)"
                  />
                )}
                {confirmedH === 0 && (
                  <rect
                    x={xBase}
                    y={chartPaddingTop + chartHeight - 2}
                    width={barWidth}
                    height={2}
                    rx={1}
                    fill="var(--border-default)"
                  />
                )}

                {/* Weighted bar */}
                {weightedH > 0 && (
                  <rect
                    x={xBase + barWidth + groupGap}
                    y={weightedY}
                    width={barWidth}
                    height={weightedH}
                    rx={3}
                    fill="var(--accent-border)"
                  />
                )}
                {weightedH === 0 && (
                  <rect
                    x={xBase + barWidth + groupGap}
                    y={chartPaddingTop + chartHeight - 2}
                    width={barWidth}
                    height={2}
                    rx={1}
                    fill="var(--border-default)"
                  />
                )}

                {/* Year label */}
                <text
                  x={centerX}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--text-tertiary)"
                >
                  {d.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 text-[12px] text-text-secondary">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent flex-shrink-0" />
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent-border flex-shrink-0" />
          <span>Weighted pipeline</span>
        </div>
      </div>
    </div>
  );
}
