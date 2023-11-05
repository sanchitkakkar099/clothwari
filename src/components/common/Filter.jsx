import React from "react";
// dependencies
import { matchSorter } from "match-sorter";
import ReactDatePicker from "react-datepicker";
// text search input
export function TextSearchFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  console.log('filterValue',filterValue);
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search...`}
    />
  );
}

export function DateSearchFilter({
    column: { filterValue, preFilteredRows, setFilter }
  }) {
    console.log('filterValue',filterValue);
    return (
      <ReactDatePicker selected={filterValue} onChange={(date) => setFilter(date || '')} placeholderText="Date" />
      // <input
      //   value={filterValue || ""}
      //   onChange={(e) => {
      //     setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      //   }}
      //   placeholder={`Search BirthDate`}
      //   type="date"
      // />
    );
  }

// a dropdown list filter
export function DropdownFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  console.log('preFilteredRows',preFilteredRows);
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function matchSorterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}