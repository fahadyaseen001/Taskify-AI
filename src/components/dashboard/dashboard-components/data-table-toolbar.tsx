"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"



import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { priorities, statuses, usePrepareAssigneeOptions } from "../dashboard-utils/options-data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { options: assigneeOptions , isLoading, isError } = usePrepareAssigneeOptions()


  return (
    <div className="w-full space-y-4 md:space-y-0">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
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
