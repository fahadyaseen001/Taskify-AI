"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"



import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { priorities, statuses, usePrepareAssigneeOptions } from "../dashboard-utils/options-data"
import Loader from "@/components/pages/loader"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { options: assigneeOptions , isLoading, isError } = usePrepareAssigneeOptions()


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
          <>
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <span className="text-red-500 text-sm">Failed to load users</span>
            ) : (
              <DataTableFacetedFilter
                column={table.getColumn("assignee")}
                title="Assignee"
                options={assigneeOptions}
              />
            )}
          </>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}