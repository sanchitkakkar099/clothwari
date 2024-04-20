import React from "react";
// dependencies
import { matchSorter } from "match-sorter";
import ReactDatePicker from "react-datepicker";
import ReactSelect from "react-select";
// text search input
export function TextSearchFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
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
    return (
      <ReactDatePicker selected={filterValue} onChange={(date) => setFilter(date || '')} placeholderText="Date" />
    );
}

export function SessionDropDown({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  return (
    <select onChange={(e) => setFilter(e.target.value)}
    >
      <option value={""}>All</option>
      <option value={false}>Active</option>
      <option value={true}>In-Active</option>
    </select>
  );
}

// a dropdown list filter
export function DropdownFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
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