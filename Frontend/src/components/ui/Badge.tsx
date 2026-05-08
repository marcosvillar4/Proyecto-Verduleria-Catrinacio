type BadgeColor = 'green' | 'red' | 'orange' | 'blue' | 'gray';

const colorMap: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
};

export function Badge({ color, text }: { color: BadgeColor; text: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[color]}`}>
      {text}
    </span>
  );
}
