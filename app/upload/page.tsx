"use client";

import UploadImage from "@/cloudinary/uploadImage";
import React, { useState } from "react";

const UploadPage = () => {
  const [uploadUrl, setUploadedUrl] = useState("");
  return <UploadImage setUploadedUrl={setUploadedUrl} />;
};

export default UploadPage;
