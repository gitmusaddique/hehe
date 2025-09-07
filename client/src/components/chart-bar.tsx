interface ChartBarProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
}

export function ChartBar({ data, labels, height = 96, color = "bg-primary" }: ChartBarProps) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="flex items-end justify-between space-x-2" style={{ height }}>
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * height;
        const opacity = 0.4 + (value / maxValue) * 0.6; // Dynamic opacity
        
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`${color} rounded-t`}
              style={{ 
                height: barHeight, 
                width: 24,
                opacity 
              }}
              data-testid={`chart-bar-${index}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ChartBarWithLabels({ data, labels, height = 96, color = "bg-primary" }: ChartBarProps) {
  return (
    <div className="space-y-2">
      <ChartBar data={data} height={height} color={color} />
      {labels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
