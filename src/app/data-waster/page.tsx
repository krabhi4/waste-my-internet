"use client";

import { useState } from "react";
import BreadcrumbSet from "@/components/BreadcrumbSet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider, NumberInput } from "@mantine/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiPlay1, CiStop1 } from "react-icons/ci";
import { FaStop, FaPlay } from "react-icons/fa";
import {
  MdDataThresholding,
  MdOutlineSpeed,
  MdAccessTime,
} from "react-icons/md";
import useDataWaster from "@/lib/hooks/data-waster";
import { api } from "@/trpc/react";

function DataWasterPage() {
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileSizeUnit, setFileSizeUnit] = useState<"MB" | "GB" | "TB">("MB");
  const [unlimitedData, setUnlimitedData] = useState<boolean>(true);
  const [threads, setThreads] = useState<number>(5);
  const [id, setId] = useState<string>("");

  const {
    wasting,
    totalWasted,
    wastingSpeed,
    elapsedTime,
    startWasting,
    stopWasting,
  } = useDataWaster({
    unlimitedData,
    fileSize,
    fileSizeUnit,
    threads: Math.floor(threads / 5), // Convert to actual thread count
  });

  const { mutate: create } = api.dataWaster.create.useMutation({
    onSuccess(data) {
      setId(data?.id);
    },
  });
  const { mutate: update } = api.dataWaster.update.useMutation();
  const { data: ip } = api.upload.getIp.useQuery();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleWasteButtonClick = () => {
    if (wasting) {
      stopWasting();
      if (id === "" && totalWasted > 0) {
        create({
          totalWasted,
          userId: !isNaN(Number(ip?.split(".")[0])) ? ip ?? "" : "",
        });
      }
      if (id !== "" && totalWasted > 0) {
        update({
          id,
          totalWasted,
          userId: !isNaN(Number(ip?.split(".")[0])) ? ip ?? "" : "",
        });
      }
    } else {
      startWasting();
    }
  };

  return (
    <>
      <BreadcrumbSet page="data-waster" />
      <div className="flex min-h-[85dvh] w-full flex-col gap-5 px-5">
        <h1 className="text-2xl font-semibold md:text-5xl">Data Waster</h1>
        <p>Just press the button and watch your bill go up</p>
        <div className="flex items-center gap-x-5">
          <p>Waste Unlimited Data?</p>
          <Switch
            checked={unlimitedData}
            onCheckedChange={(value) => {
              setUnlimitedData(value);
              stopWasting();
            }}
          />
        </div>
        {!unlimitedData && (
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
                setFileSizeUnit(value as "MB" | "GB" | "TB")
              }
            >
              <SelectTrigger className="w-[180px] rounded-none rounded-r-md border-l-0">
                <SelectValue placeholder="Size Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MB">MB</SelectItem>
                <SelectItem value="GB">GB</SelectItem>
                <SelectItem value="TB">TB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <p>
          Download threads (higher is for faster wasting, lower is for more
          precision)
        </p>
        <Slider
          color="dark"
          size="sm"
          value={threads}
          onChange={setThreads}
          label={(value) => `${value / 5} threads`}
          labelTransitionProps={{
            transition: "skew-down",
            duration: 150,
            timingFunction: "linear",
          }}
          styles={{
            label: {
              marginLeft: threads > 50 ? -40 : 40,
            },
          }}
          marks={marks}
          step={5}
          className="mb-5"
        />
        <Button className="group w-40" onClick={handleWasteButtonClick}>
          {wasting ? (
            <>
              <CiStop1 className="mr-2 group-hover:hidden" />
              <FaStop className="mr-2 hidden rounded-md group-hover:block" />
            </>
          ) : (
            <>
              <CiPlay1 className="mr-2 group-hover:hidden" />
              <FaPlay className="mr-2 hidden rounded-md group-hover:block" />
            </>
          )}
          {wasting ? "Stop Wasting" : "Start Wasting"}
        </Button>
        <div className="flex items-center gap-x-5">
          <MdDataThresholding size={30} />
          <div className="flex flex-col">
            <p>Total Data Wasted</p>
            <p className="text-xs">{formatBytes(totalWasted)}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-5">
          <MdOutlineSpeed size={30} />
          <div className="flex flex-col">
            <p>Wasting speed</p>
            <p className="text-xs">{formatBytes(wastingSpeed)}/s</p>
          </div>
        </div>
        <div className="flex items-center gap-x-5">
          <MdAccessTime size={30} />
          <div className="flex flex-col">
            <p>Time</p>
            <p className="text-xs">{formatTime(elapsedTime)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataWasterPage;

const marks = [
  { value: 5, label: "1" },
  { value: 10, label: "2" },
  { value: 15, label: "3" },
  { value: 20, label: "4" },
  { value: 25, label: "5" },
  { value: 30, label: "6" },
  { value: 35, label: "7" },
  { value: 40, label: "8" },
  { value: 45, label: "9" },
  { value: 50, label: "10" },
  { value: 55, label: "11" },
  { value: 60, label: "12" },
  { value: 65, label: "13" },
  { value: 70, label: "14" },
  { value: 75, label: "15" },
  { value: 80, label: "16" },
  { value: 85, label: "17" },
  { value: 90, label: "18" },
  { value: 95, label: "19" },
  { value: 100, label: "20" },
];
