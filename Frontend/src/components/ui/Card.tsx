interface CardProps {
  title: string;
  value: string | number;
  color?: 'green' | 'blue' | 'orange' | 'red';
}

const colorMap = {
  green: 'text-green-600',
  blue: 'text-blue-600',
  orange: 'text-orange-500',
  red: 'text-red-600',
};

export function Card({ title, value, color = 'green' }: CardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-1 text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
