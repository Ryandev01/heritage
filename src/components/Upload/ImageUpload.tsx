import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import styled from 'styled-components';
import { CustomUploadProps } from '../../types/CustomDrawerTypes';
import { Box, Typography } from '@mui/material';
import styles from './index.module.css'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import UPloadImage from '../../assets/images/UploadVideoImage.png';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};



const StyledUpload = styled(Upload)`
    .upload-wrapper .ant-upload.ant-upload-select-picture-card,
    .ant-upload-select-picture-card {
        width: 100% !important;
        height: auto;
        aspect-ratio: 1/1;
    }
`

const ImageUpload = ({
    title,
    existingImageUrl,
    uploadImage,
    defaultImages,
    handleDelete,
    accept
}: CustomUploadProps) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(existingImageUrl);

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {

            if (info.file.status !== 'uploading') {
                setLoading(true);
            }
            if (info.file.status === 'removed') {
                setImageUrl('');
            }
            if (info.file.status === 'done') {

                setLoading(false);
                message.success(`${info.file.name} file uploaded successfully`);
                // Get this url from response in real world.
                getBase64(info.file.originFileObj as RcFile, url => {
                    setLoading(false);
                    setImageUrl(url);
                });

            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.${info.file.error?.message ? `:${info.file.error?.message}` : ''}`);
            }
        

      }
    const handleRemove: UploadProps['onRemove'] = (file: UploadFile<any>) => {
        if (handleDelete) {
            handleDelete(file);
        }
      }


    const uploadButton = (
        <div>
            {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
            <Box component="img" src={UPloadImage} alt="Upload your file" width={363}>
                {/* WIP */}
                {/* <ImageOutlinedIcon /> */}
            </Box>
            {/* <div style={{ marginTop: 8 }}>{title}</div> */}
        </div>
    );

    return (
        <>
            <StyledUpload
                name={'file'}
                accept={accept}
                multiple={false}
                maxCount={1}
                onChange={handleChange}
                customRequest={uploadImage}
                onRemove={handleRemove}
                defaultFileList={defaultImages || []}
            >
                {
                    imageUrl ?
                        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                        (
                            !defaultImages ||
                            (
                                defaultImages && (defaultImages.length < 1)
                            )
                        ) ?
                            uploadButton :
                            <></>
                }
            </StyledUpload>

        </>
    )
};


export default ImageUpload;