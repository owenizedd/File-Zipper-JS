import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import JSZip from "jszip";
import FileSaver from 'file-saver';


import { 
  Layout, 
  Menu, 
  Breadcrumb,
  Card,
  Upload,
  Button,
  message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import 'antd/dist/antd.css';

function App() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  function getAsByteArray(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
  
      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  const handleUpload = async() => {
    setUploading(true);

    let zip = new JSZip();
    fileList.forEach(async file => {
      zip.file(file.name, file, {binary: true});
    })
    const content =  await zip.generateAsync({type: "base64"})
    window.location.href = "data:application/zip;base64," + content;
    message.success('Berhasil membuat zip.');  
    
    setUploading(false);
  };

  const uploadProps = {
    multiple: true,
    onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    },
    beforeUpload: file => {
      
      setFileList([...fileList, file]);
      
      return false;
    },
    fileList,
  };
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key={1}>File Zipper</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>File Zipper</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Card type="inner" title="Pilih file yang ingin dikumpul">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Pilih satu satu ya manis :)</Button>
              </Upload>
                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? 'Uploading' : 'Buat zip!'}
                </Button>
          </Card>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Dibuat untuk pengumpul tugas meme</Footer>
    </Layout>
  )
}

export default App
