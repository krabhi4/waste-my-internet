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
import { LuAlertTriangle, LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadResponse {
  autoDelete: boolean;
  created: string;
  description: string | null;
  downloads: number;
  expires: string;
  id: string;
  key: string;
  link: string;
  maxDownloads: number;
  mimeType: string;
  modified: string;
  name: string;
  nodeType: string;
  path: string;
  planId: number;
  private: boolean;
  screeningStatus: string;
  size: number;
  status: number;
  success: boolean;
  title: string | null;
}

function SendToVoidPage() {
  const [multiple, setMultiple] = useState<boolean>(false);
  const [file, setFile] = useState<File | File[] | null>(null);
  const [ip, setIp] = useState<string>("Loading...");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

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
      console.log("Error uploading file:", error.message);
    },
  });

  //   console.log("file", file);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    if (Array.isArray(file)) {
      file.forEach((f, index) => formData.append(`file${index}`, f));
    } else {
      formData.append("file", file);
    }

    setIsUploading(true);
    const xhr = new XMLHttpRequest();
    // xhr.open("POST", "https://file.io", true);
    xhr.open("POST", "https://httpbin.org/post", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText) as FileUploadResponse;
        if (!multiple && file) {
          upload({
            file: [
              {
                size: Array.isArray(file) ? file[0]?.size ?? 0 : file?.size,
                fileName: Array.isArray(file)
                  ? file[0]?.name ?? ""
                  : file?.name,
              },
            ],
            userId: !isNaN(Number(ip.split(".")[0])) ? ip : "",
            response: JSON.stringify(response),
          });
        }
        if (multiple && Array.isArray(file) && file.length > 1) {
          upload({
            file: file.map((f) => ({
              fileName: f.name,
              size: f.size,
            })),
            userId: !isNaN(Number(ip.split(".")[0])) ? ip : "",
            response: JSON.stringify(response),
          });
        }
        setFile(null);
        setProgress(0);
      } else {
        console.error("Upload failed:", xhr.statusText);
        toast.error(`Error uploading file: ${xhr.statusText}`);
      }
      setIsUploading(false);
    };

    xhr.onerror = function () {
      console.error("Upload error:", xhr.statusText);
      toast.error(`Error uploading file: ${xhr.statusText}`);
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  return (
    <div className="flex min-h-[80dvh] w-full items-center justify-center">
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
          {progress > 0 && <Progress className="mt-5" value={progress} />}
        </CardContent>
        <CardFooter className="justify-center gap-x-3">
          <Button
            disabled={!file || isPending || isUploading}
            onClick={handleUpload}
            className="w-full max-w-32"
          >
            {isUploading || isPending ? (
              <LuLoader2 className="mr-2 animate-spin" />
            ) : null}
            Upload
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <LuAlertTriangle color="red" />
            </TooltipTrigger>
            <TooltipContent side="right">
              {!file && "Please enter a valid file size."}
              <br />
              Caution: Please dont upload any confidential file!!!
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SendToVoidPage;
