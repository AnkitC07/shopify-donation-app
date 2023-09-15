import React, { useRef, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";
import { Button, Icon } from "@shopify/polaris";
import { SortMinor } from "@shopify/polaris-icons";

function FileUploader() {
    const fetch = useAuthenticatedFetch();
    const [loading, setLoading] = useState(false);
    const sortIcon = <Icon source={SortMinor} color="base" />;
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Call the backend API to upload the file
            handleUpload(formData);
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleUpload = async (formData) => {
        console.log(...formData);
        try {
            setLoading(true);
            const req = await fetch(`/api/import_products`, {
                method: "POST",
                body: formData,
            });
            const res = await req.json();
            fileInputRef.current.value = null;
            if (res) {
                setLoading(false);
                console.log(res);
            }

            // Handle response here
        } catch (error) {
            setLoading(false);
            console.error("Error uploading file:", error);
        }
    };

    const fileInputRef = useRef(null); // Moved the ref assignment here

    return (
        <div>
            <Button loading={loading} icon={sortIcon} onClick={handleImportClick}>
                Import CSV
            </Button>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
        </div>
    );
}

export default FileUploader;
