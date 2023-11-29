import {useState} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { Box, Grid } from "@mui/material";
import styled from 'styled-components';
import styles from './index.module.css';
import {uploadMedia} from '../../api/upload';
import axios from 'axios';
import { getToken } from '../../utils/storage/storage';

const StyledFileUpload = styled.div`
  .anticon.anticon-upload {
    display: none;
  }
  .ant-btn > .anticon + span {
    margin-left: 0;
  }

  .ant-btn.ant-btn-default {
    background-color: #f4f4f4;
  }

  .ant-upload-list-text .ant-upload-list-item-name {
    max-width: 88%;
    text-overflow: 
  }
`

const FileUpload = ({uploadImage, defaultImages}: {uploadImage: (options: any) => void , defaultImages: any[]}) => {

  const [defaultFileList, setDefaultFileList] = useState([]);

  const handleChange = (info: any) => {
    const nextState: any = {};
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    setDefaultFileList(info.fileList);
  }
  const props: UploadProps = {
    name: 'file',
    accept: ".xls,.xlsx,.pdf,.doc,.docx,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    maxCount: 1,
    customRequest: uploadImage,
    onChange: handleChange,
    defaultFileList: defaultImages
  };
  return <div>
    <Box component="div" className={`${styles['file-upload-wrapper']}`}>
      <Grid container style={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Grid item>
          <StyledFileUpload>
            <Upload {...props} >
              <Button icon={<UploadOutlined />}>
                Select file...
              </Button >
            </Upload>
          </StyledFileUpload>
        </Grid>
        <Grid item>
          Drop file here to select
        </Grid>
      </Grid>
    </Box>
  </div>
};

export default FileUpload;