import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localPath,foldername,id) {
	try {
        console.log(cloudinary.config())
		if (!localPath) return null;
		const uploadResult = await cloudinary.uploader.upload(localPath, {
			   public_id: `${id.toString()}`,
			folder:`myPlayer/${foldername}`,
			resource_type: "auto",
            overwrite:true,
		});
        console.log("dekho bhai",uploadResult)
		fs.unlinkSync(localPath);
		return uploadResult;
	} catch (error) {
		fs.unlinkSync(localPath);
		console.log("error in cloudinary ", error);
		return null;
	}
};

export {uploadOnCloudinary}