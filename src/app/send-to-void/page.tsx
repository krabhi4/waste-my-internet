import BreadcrumbSet from "@/components/BreadcrumbSet";
import UploadFile from "@/components/send-to-void/UploadFile";

function SendToVoidPage() {
  return (
    <>
      <BreadcrumbSet page="upload-file" />
      <div className="flex min-h-[80dvh] w-full items-center justify-center">
        <UploadFile />
      </div>
    </>
  );
}

export default SendToVoidPage;
