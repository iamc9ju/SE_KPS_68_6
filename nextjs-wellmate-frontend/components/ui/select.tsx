import * as React from "react"

export const Select = ({ children, onValueChange, value }: any) => {
  return <div className="relative inline-block text-sm group/select">{children}</div>
}

export const SelectTrigger = ({ children, className }: any) => {
  return (
    <div className={`flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${className || ''}`}>
      {children}
    </div>
  )
}

export const SelectContent = ({ children }: any) => {
  return (
    <div className="absolute top-full z-50 mt-1 hidden min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md group-hover/select:block">
      {children}
    </div>
  )
}

export const SelectItem = ({ children, value }: any) => {
  return (
    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 outline-none hover:bg-gray-100 hover:text-gray-900">
      {children}
    </div>
  )
}
