import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "eu-central-1",
});
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'twitter-clonebucket',
        metadata: function (_, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (_, file, cb) {
            let fileExtension = file.originalname.split('.').pop();
            cb(null, Date.now().toString() + '.' + fileExtension);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE
    }),
});
