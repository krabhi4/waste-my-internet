"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
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
import { FileInput } from "@mantine/core";
import { LuAlertTriangle, LuLoader2 } from "react-icons/lu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatSize, formatSpeed } from "@/utils/formatSpeed";

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

const UploadFile = () => {
  const [multiple, setMultiple] = useState<boolean>(false);
  const [file, setFile] = useState<File | File[] | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [uploadedSize, setUploadedSize] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);

  const { data: ip } = api.upload.getIp.useQuery();

  const { mutate: upload, isPending } = api.upload.upload.useMutation({
    onSuccess() {
      toast.success("File uploaded successfully");
      setFile(null);
    },
    onError(error) {
      toast.error(`Error uploading file: ${error.message}`);
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    let totalFileSize = 0;
    if (Array.isArray(file)) {
      file.forEach((f, index) => {
        formData.append(`file${index}`, f);
        totalFileSize += f.size;
      });
    } else {
      formData.append("file", file);
      totalFileSize = file.size;
    }
    setTotalSize(totalFileSize);

    setIsUploading(true);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://httpbin.org/post", true);

    let startTime = Date.now();
    let lastLoaded = 0;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
        setUploadedSize(event.loaded);

        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // in seconds
        const loadDifference = event.loaded - lastLoaded;
        const speed = loadDifference / elapsedTime; // bytes per second

        setUploadSpeed(speed);

        startTime = currentTime;
        lastLoaded = event.loaded;
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
            userId: !isNaN(Number(ip?.split(".")[0])) ? ip ?? "" : "",
            response: JSON.stringify(response),
          });
        }
        if (multiple && Array.isArray(file) && file.length > 1) {
          upload({
            file: file.map((f) => ({
              fileName: f.name,
              size: f.size,
            })),
            userId: !isNaN(Number(ip?.split(".")[0])) ? ip ?? "" : "",
            response: JSON.stringify(response),
          });
        }
        setFile(null);
        setProgress(0);
      } else {
        toast.error(`Error uploading file: ${xhr.statusText}`);
      }
      setIsUploading(false);
    };

    xhr.onerror = function () {
      toast.error(`Error uploading file: ${xhr.statusText}`);
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Upload a file</CardTitle>
      </CardHeader>
      <CardContent>
        <FileInput
          className="w-full"
          placeholder={<span className="text-black">Upload a file</span>}
          multiple={multiple}
          clearable
          onChange={(files) => setFile(files)}
          value={file}
          fileInputProps={{
            "aria-labelledby": "upload-file",
          }}
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
            aria-label="Multiple files?"
          />
        </div>
        {progress > 0 && <Progress className="mt-5" value={progress} />}
        {isUploading && progress > 0 && (
          <div className="mt-2 text-sm">
            <p>{`${formatSize(uploadedSize)} / ${formatSize(totalSize)} (${progress.toFixed(2)}%)`}</p>
            <p>{`Upload speed: ${formatSpeed(uploadSpeed)}`}</p>
          </div>
        )}
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
          <TooltipTrigger aria-label="Caution">
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
  );
};

export default UploadFile;
