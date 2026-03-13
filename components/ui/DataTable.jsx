export default function DataTable({ columns, data, renderRow }) {
  return (
    <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 whitespace-nowrap">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-hover-rows">
          {data.map((item, i) => renderRow(item, i))}
        </tbody>
      </table>
    </div>
  );
}
