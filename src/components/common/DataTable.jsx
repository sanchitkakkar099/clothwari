import React from "react";
import { useTable, useFilters, usePagination,useRowSelect } from "react-table";

// utilities
import { matchSorterFn } from "../common/Filter";
import Pagination from "./Pagination";

const DataTable = (props) => {
  // MEMOS
  const data = React.useMemo(() => props?.data, [props.data]);
  const columns = React.useMemo(() => props?.columns, [props.columns]);
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: ""
    }),
    []
  );
  const filterTypes = React.useMemo(
    () => ({
      rankedMatchSorter: matchSorterFn
    }),
    []
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );
  

  // CONFIGURE useTable
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "anyThing",
          Header: ({ toggleRowSelected, isAllPageRowsSelected, page }) => {
            const modifiedOnChange = (event) => {
              page.forEach((row) => {
                //check each row if it is not disabled
                !row.original.disabled &&
                  toggleRowSelected(row.id, event.currentTarget.checked);
              });
            };

            //Count number of selectable and selected rows in the current page
            //to determine the state of select all checkbox
            let selectableRowsInCurrentPage = 0;
            let selectedRowsInCurrentPage = 0;
            page.forEach((row) => {
              row.isSelected && selectedRowsInCurrentPage++;
              !row.original.disabled && selectableRowsInCurrentPage++;
            });

            //If there are no selectable rows in the current page
            //select all checkbox will be disabled -> see page 2
            const disabled = selectableRowsInCurrentPage === 0;
            const checked =
              (isAllPageRowsSelected ||
                selectableRowsInCurrentPage === selectedRowsInCurrentPage) &&
              !disabled;

            return (
              <div>
                <IndeterminateCheckbox
                  onChange={modifiedOnChange}
                  checked={checked}
                  disabled={disabled}
                />
              </div>
            );
          },
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                disabled={row.original.disabled}
              />
            </div>
          )
        },
        ...columns
      ]);
    }
  );
  console.log('selectedFlatRows',selectedFlatRows?.map(el => el?.original));

  // RENDERING
  return (
    <>
    <table {...getTableProps()} className="list_table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {/* {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })} */}
        {page?.length > 0 && page?.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          }) || <tr><td className="text-center" colSpan={10}>No Data To Display</td></tr>}
      </tbody>
    </table>
    <Pagination
        pageCount={pageCount}
        previousPage={previousPage}
        nextPage={nextPage}
        gotoPage={gotoPage}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        setPageSize={setPageSize}
        pageSize={pageSize}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
    />
    </>
  );
};

export default DataTable;
