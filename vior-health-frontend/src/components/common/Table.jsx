import clsx from 'clsx';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider"
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
              {columns.map((column, colIndex) => {
                let cellContent;
                
                // Support both 'cell' and 'render' functions for backwards compatibility
                if (column.cell) {
                  cellContent = column.cell(row);
                } else if (column.render) {
                  cellContent = column.render(row);
                } else {
                  cellContent = row[column.accessor];
                }
                
                return (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-neutral-800"
                  >
                    {cellContent}
                  </td>
                );
              })}
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
