import clsx from 'clsx';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="w-full">
      <table className="w-full table-fixed">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-2 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={clsx(
                'hover:bg-neutral-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-2 py-2 text-sm text-neutral-800"
                >
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;
