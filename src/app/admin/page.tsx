"use client";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import BreadcrumbSet from "@/components/BreadcrumbSet";
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsVerifiedStore } from "@/store";
import { Button } from "@/components/ui/button";
import { LuLoader2 } from "react-icons/lu";

type AllData = {
  id: string;
  size: number | null;
  fileName: string | null;
  userId: string | null;
};

function AdminLoginPage() {
  const [otp, setOtp] = useState<string>("");
  const [isWrongOTP, setIsWrongOTP] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { isVerified, setIsVerified } = useIsVerifiedStore();

  const {
    data: otpData,
    isFetching,
    error,
  } = api.admin.verify.useQuery(
    { otp },
    {
      enabled: otp.length === 6,
    },
  );

  const {
    data: allData,
    isFetching: isLoading,
    refetch,
  } = api.upload.getData.useQuery();

  const { mutate, isPending } = api.upload.delete.useMutation({
    onSuccess() {
      toast.success("Files deleted successfully");
      setSelectedRowIds([]);
      setRowSelection({});
      void refetch();
    },
    onError(error) {
      toast.error(`Error deleting files: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!error) {
      if (otpData === true) {
        setIsVerified(true);
        setIsWrongOTP(false);
        toast.success("OTP verified successfully");
      }
      if (otpData === false) {
        setIsWrongOTP(true);
      }
    }
    if (error) {
      toast.error(`Error verifying OTP: ${error.message}`);
    }
  }, [otpData, error, setIsVerified]);

  const data: AllData[] = allData ?? [];

  const columns: ColumnDef<AllData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="border-custom-blue"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const allIds = data.map((row) => row.id);
            setSelectedRowIds(table.getIsAllPageRowsSelected() ? [] : allIds);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border-custom-blue"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            const rowOriginal = row.original;
            const rowId = rowOriginal.id;
            if (value) {
              setSelectedRowIds(
                (prevSelectedRowIds) =>
                  [...prevSelectedRowIds, rowId] as string[],
              );
            } else {
              setSelectedRowIds((prevSelectedRowIds) =>
                prevSelectedRowIds.filter((id) => id !== rowId),
              );
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "fileName",
      header: "File Name",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    state: {
      rowSelection,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
  });

  if (!isVerified) {
    return (
      <>
        <BreadcrumbSet page="admin" />
        <div className="flex min-h-[80dvh] items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Enter your OTP</CardTitle>
            </CardHeader>
            <CardContent>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isFetching}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className={isWrongOTP ? "border-r-0 border-red-500" : ""}
                  />
                  <InputOTPSlot
                    index={1}
                    className={isWrongOTP ? "border-r-0 border-red-500" : ""}
                  />
                  <InputOTPSlot
                    index={2}
                    className={isWrongOTP ? "border-red-500" : ""}
                  />
                </InputOTPGroup>
                <InputOTPSeparator
                  className={isWrongOTP ? "text-red-500" : ""}
                />
                <InputOTPGroup>
                  <InputOTPSlot
                    index={3}
                    className={isWrongOTP ? "border-r-0 border-red-500" : ""}
                  />
                  <InputOTPSlot
                    index={4}
                    className={isWrongOTP ? "border-r-0 border-red-500" : ""}
                  />
                  <InputOTPSlot
                    index={5}
                    className={isWrongOTP ? "border-red-500" : ""}
                  />
                </InputOTPGroup>
              </InputOTP>
              {isWrongOTP && (
                <p className="mt-2 text-center text-sm text-red-500">
                  Wrong OTP, please try again.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  if (isVerified) {
    return (
      <>
        <BreadcrumbSet page="admin" />
        <div className="min-h-[85dvh] bg-white">
          <div className="flex grow items-center justify-end bg-gray-50 px-5 py-1 pb-2.5 md:px-10">
            <Button
              disabled={selectedRowIds.length === 0 || isLoading || isPending}
              className="w-32"
              onClick={() => mutate(selectedRowIds)}
            >
              {isPending && <LuLoader2 className="mr-2 animate-spin" />}Delete
            </Button>
          </div>
          <div className="mt-2.5 px-2 md:px-5">
            <DataTable table={table} columns={columns} />
          </div>
        </div>
      </>
    );
  }
}

export default AdminLoginPage;
