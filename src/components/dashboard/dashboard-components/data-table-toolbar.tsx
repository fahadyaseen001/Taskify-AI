"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import debounce from "lodash/debounce"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { priorities, statuses, usePrepareAssigneeOptions } from "../dashboard-utils/options-data"
import { useCallback, useMemo, useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { options: assigneeOptions , isLoading, isError } = usePrepareAssigneeOptions()

  const [inputValue, setInputValue] = useState("")
  
  // Memoized debounced filter function
  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        table.getColumn("title")?.setFilterValue(value)
      }, 150),
    [table]
  )

  // Memoized onChange handler
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (value !== inputValue) {
        setInputValue(value)
        debouncedFilter(value)
      }
    },
    [debouncedFilter, inputValue]
  )


  return (
    <div className="w-full space-y-4 md:space-y-0">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Filter tasks..."
          value={inputValue}
          onChange={handleInputChange}
          className="h-8 w-full md:w-[250px]"
        />
        <div className="flex flex-wrap gap-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
          {table.getColumn("assignee") && (           
            <DataTableFacetedFilter
              column={table.getColumn("assignee")}
              title="Assignee"
              options={assigneeOptions}
              isSingleSelect={true}
              isLoading={isLoading}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
