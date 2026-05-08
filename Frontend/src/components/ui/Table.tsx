import { Spinner } from './Spinner';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: (row: T) => string | number;
}

export function Table<T>({ columns, data, loading = false, rowKey }: TableProps<T>) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
          <Spinner />
        </div>
      )}
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && !loading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                Sin datos
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
