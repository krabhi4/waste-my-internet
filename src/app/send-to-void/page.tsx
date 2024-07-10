"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import { FileInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";
import axios from "axios";

function SendToVoidPage() {
  const [multiple, setMultiple] = useState<boolean>(false);
  const [file, setFile] = useState<File | File[] | null>(null);
  const [ip, setIp] = useState<string>("Loading...");

  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        setIp("Failed to get IP");
      }
    };

    void getIp();
  }, []);

  const { mutate: upload, isPending } = api.upload.upload.useMutation({
    onSuccess() {
      toast.success("File uploaded successfully");
      setFile(null);
    },
    onError(error) {
      toast.error(`Error uploading file: ${error.message}`);
    },
  });

  console.log("file", file);

  const handleUpload = async () => {
    if (!multiple && file) {
      upload({
        file: [
          {
            size: Array.isArray(file) ? file[0]?.size ?? 0 : file?.size,
            fileName: Array.isArray(file) ? file[0]?.name ?? "" : file?.name,
          },
        ],
        userId: !isNaN(Number(ip.split(".")[0])) ? ip : "",
      });
    }
    if (multiple && Array.isArray(file) && file.length > 1) {
      upload({
        file: file.map((f) => ({
          fileName: f.name,
          size: f.size,
        })),
        userId: !isNaN(Number(ip.split(".")[0])) ? ip : "",
      });
    }
  };

  return (
    <div className="flex min-h-[90dvh] w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Upload a file</CardTitle>
        </CardHeader>
        <CardContent>
          <FileInput
            className="w-full"
            placeholder="Upload a file"
            multiple={multiple}
            clearable
            onChange={(files) => setFile(files)}
            value={file}
          />
          <div className="mt-3 flex items-center space-x-2">
            <Label htmlFor="multiple">Multiple?</Label>
            <Switch
              id="multiple"
              checked={multiple}
              onCheckedChange={(check) => {
                setMultiple(check);
                setFile(null);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            disabled={!file || isPending}
            onClick={handleUpload}
            className="w-full max-w-32"
          >
            {isPending && <LuLoader2 className="mr-2 animate-spin" />}Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SendToVoidPage;
