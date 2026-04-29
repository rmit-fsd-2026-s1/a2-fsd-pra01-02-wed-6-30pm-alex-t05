import { User } from "../types/user";

export function fileUploader(user: User, file: File) : Promise<{success: boolean, message: string, updatedUser?: User}> {
    return new Promise((resolve) => {
        const allowedTypes = ["application/pdf", "image/png", "image/jpg", "image/jpeg"];
        //restricts file types to pdf, png and jpeg
        if (!allowedTypes.includes(file.type)) {
            resolve({ success: false, message: "Unsupported file type. Please upload a PDF or image file." });
            return;
        }
        //empty checker
        if (!file) {
            resolve({ success: false, message: "No file selected." });
            return;
        }
        //file size limit of 2MB
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            resolve({ success: false, message: "File size exceeds 2MB limit." });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            //construct updated user
            const updatedUser: User = {
                ...user,
                complianceDocuments: [...(user.complianceDocuments || []), {
                    fileName: file.name,
                    fileType: file.type,
                    data: base64String
                }]
            };
            //returns updated user to be handled by caller
            resolve({ success: true, message: "File uploaded successfully.", updatedUser });
        }
        reader.onerror = () => {
            resolve({ success: false, message: "Error reading file." });
        };
        reader.readAsDataURL(file);
    });
}