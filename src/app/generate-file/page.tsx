"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NumberInput } from "@mantine/core";
import { useState } from "react";
import { LuAlertTriangle, LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";

function GenerateFilePage() {
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileSizeUnit, setFileSizeUnit] = useState<"KB" | "MB" | "GB">("KB");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const generateAndDownloadFile = async () => {
    if (fileSize === 0) {
      toast.error("Please enter a valid file size");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      let sizeInBytes: number;
      switch (fileSizeUnit) {
        case "KB":
          sizeInBytes = fileSize * 1024;
          break;
        case "MB":
          sizeInBytes = fileSize * 1024 * 1024;
          break;
        case "GB":
          sizeInBytes = fileSize * 1024 * 1024 * 1024;
          break;
        default:
          throw new Error("Invalid file size unit");
      }

      const chunkSize = 1024 * 1024; // 1 MB chunks
      const chunksCount = Math.ceil(sizeInBytes / chunkSize);
      const chunks: Uint8Array[] = [];

      for (let i = 0; i < chunksCount; i++) {
        const remainingBytes = sizeInBytes - i * chunkSize;
        const currentChunkSize = Math.min(remainingBytes, chunkSize);
        chunks.push(new Uint8Array(currentChunkSize));

        // Simulate some processing time and update progress
        await new Promise((resolve) => setTimeout(resolve, 10));
        const currentProgress = Math.round(((i + 1) / chunksCount) * 100);
        setProgress(currentProgress);
      }

      const blob = new Blob(chunks, { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `empty_file_${fileSize}${fileSizeUnit}.bin`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        `Empty file of size ${fileSize} ${fileSizeUnit} generated and download started`,
      );
    } catch (error) {
      console.error("Error generating file:", error);
      toast.error(
        "An error occurred while generating the file. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="mb-2 text-center text-xl font-semibold">
            Generate Empty File
          </h2>
          <div className="flex w-full items-center">
            <NumberInput
              styles={{
                input: {
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                  borderRightWidth: "0",
                  height: "2.5rem",
                  borderColor: "#e2e8f0",
                },
              }}
              withKeyboardEvents={false}
              allowDecimal={false}
              allowLeadingZeros={false}
              allowNegative={false}
              hideControls
              className="h-10 w-full"
              value={fileSize}
              onChange={(value) => setFileSize(value as number)}
              placeholder="File Size"
            />
            <Select
              value={fileSizeUnit}
              onValueChange={(value) =>
                setFileSizeUnit(value as "KB" | "MB" | "GB")
              }
            >
              <SelectTrigger className="w-[180px] rounded-none rounded-r-md border-l-0">
                <SelectValue placeholder="Size Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KB">KB</SelectItem>
                <SelectItem value="MB">MB</SelectItem>
                <SelectItem value="GB">GB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {progress > 0 && <Progress className="mt-5" value={progress} />}

          <div className="mt-5 flex items-center justify-center gap-x-3">
            <Button
              disabled={fileSize === 0 || isLoading}
              onClick={generateAndDownloadFile}
            >
              {isLoading && <LuLoader2 className="mr-2 animate-spin" />}
              Generate and Download File
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <LuAlertTriangle color="red" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {fileSize === 0 && "Please enter a valid file size."}
                <br />
                Caution: Please enter filesize less than your empty RAM!!!
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateFilePage;
