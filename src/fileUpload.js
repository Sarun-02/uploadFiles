import { useEffect, useState } from "react";
import "./fileUpload.css";
import axios from "axios";

function FileUpload() {
  const [filesInBucket, setFilesInBucket] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const getSignedUrl = async (
    bucketName,
    key,
    expiration,
    file,
    methodType
  ) => {
    const lambdaApiUrl =
      "https://khd2kxkvsi53wec3hgkz2yzeru0zprpt.lambda-url.us-east-1.on.aws/";
    let requestBody;
    let response;
    if (methodType === "filesList") {
      requestBody = {
        bucket: bucketName,
        methodType,
      };
      response = await axios.post(lambdaApiUrl, requestBody);
    } else {
      requestBody = {
        bucket: bucketName,
        key,
        expiration: expiration || 3600, // optional, seconds
        contentType: file?.type || null,
        methodType,
      };
      response = await axios.post(lambdaApiUrl, requestBody);
    }
    return response?.data?.presigned_url || response?.data?.filesList;
  };

  // Function to handle single file upload
  const uploadFileToS3 = async (file) => {
    try {
      const presignedUrl = await getSignedUrl(
        "akshidocuments",
        file.name,
        60 * 60,
        file,
        "presignedUrl"
      );
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      return file.name;
    } catch (error) {
      console.log("Error uploading files", error.message);
    }
  };

  // Handle multiple files
  const handleFiles = async (files) => {
    const filesArray = Array.from(files);
    setTotalFiles(filesArray?.length)
    const uploadedKeys = [];
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const key = await uploadFileToS3(file);
      uploadedKeys.push(key);
    }
    setTotalFiles(uploadedKeys?.length - totalFiles);
    const filesList = await getSignedUrl(
      "akshidocuments",
      null,
      null,
      null,
      "filesList"
    );
    setFilesInBucket(filesList);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filesList = await getSignedUrl(
          "akshidocuments",
          null,
          null,
          null,
          "filesList"
        );
        setFilesInBucket(filesList);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="secondPage">
      <div
        className="uploadContainer"
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()} // allow drop
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p>
          📂 Upload <br />
          or drag and drop on me
        </p>
        <p>Total files uploading: {totalFiles}</p>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          multiple // allow multiple files
          onChange={(e) => {
            if (e.target.files.length > 0) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>
      <div
        style={{
          marginTop: "15px",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px",
          fontSize: "14px",
        }}
      >
        {filesInBucket.length > 0 ? (
          filesInBucket.map((file, idx) => <p key={idx}>{file}</p>)
        ) : (
          <p style={{ color: "#777" }}>No files available in bucket</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
