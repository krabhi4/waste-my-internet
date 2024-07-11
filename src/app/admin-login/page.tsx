"use client";
import { useState } from "react";

function AdminLoginPage() {
  const [isVerified, setIsVerified] = useState<boolean>(false);


  if (!isVerified) {
    return (<div className="flex items-center justify-center min-h-[80dvh]"></div>)
  }
  if (isVerified) {
    
  }
}

export default AdminLoginPage;
