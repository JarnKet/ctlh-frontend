import React, { useState } from "react";
// import { PRESIGNED_URL } from '../apollo/uploadFile'
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { Badge } from "@material-ui/core";
// import { useMutation } from "@apollo/react-hooks";
import { v4 as uuidv4 } from 'uuid';

const UploadFile = () => {

  // const [uploadPhoto] = useMutation(PRESIGNED_URL);
  const [nameFile, setNameFile] = useState([]);

  const [imageLoading, setImageLoading] = useState();
  const handleUpload = async (event) => {
    let nameFiles = [...nameFile]
    setImageLoading("");
    try {
      let fileData = event?.target?.files[0].name;

      let fileDatatype = event?.target?.files[0]?.type;
      let fileNames = uuidv4() + '.' + fileDatatype.split('/')[1].toString()

      let checkFileUpload = fileDatatype.split("/")[0] === "application"

      if (checkFileUpload === false) {
        Swal.fire({
          icon: "error",
          title: "ກະລຸນາເລືອກໄຟຣເອກະສານ",
          showConfirmButton: false,
          timer: 1500,
        });
        return
      }
      // const resUploadPhoto = await uploadPhoto({
      //   // variables: { fileName: (fileData).toString(), mimeType: (fileDatatype).toString() },
      //   variables: { fileName: fileNames, mimeType: (fileDatatype).toString() },
      // });

      // let afterUpload = await axios({
      //   method: "put",
      //   url: resUploadPhoto.data.preSignedUrl.url,
      //   data: fileDataBoole,
      //   headers: {
      //     "Content-Type": " file/*; image/*",
      //     "Access-Control-Allow-Origin": "*",
      //     "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
      //     "Access-Control-Allow-Headers":
      //       "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
      //   },
      //   onUploadProgress: function (progressEvent) {
      //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //     setImageLoading(percentCompleted)
      //   }
      // });
      nameFiles.push({
        name :fileData,
        link:fileNames
      });
      setNameFile(nameFiles);
    } catch (error) {
      console.log(error)
     }
  };
  const _onDeleteFile = (item) => {
    let filnameData = nameFile?.filter((data) => data?.name !== item)
    setNameFile(filnameData)
  }
  const buttonUploadAndShowFile = () => {
    return (
      <div className='form-row'>
        <div className='col-12'>
          <div className='form-group'>
            <div style={{ textAlign: 'center' }}>
              {nameFile?.map((item,index) => <Badge badgeContent="X" color="secondary" style={{ padding: 10 }} onClick={() => _onDeleteFile(item?.name)}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column", padding: 15 }}>
                    <FontAwesomeIcon icon={faFileAlt}
                      style={{ fontSize: 50 }}
                      className="iconDetail" />
                    <p>
                      {item?.name}
                    </p>
                  </div>
              </Badge>)}
              <div style={{ height: 60 }}></div>
              <label>ອັບໂຫຼດໄຟຣເອກະສານ</label>
              <div>
                <input
                  type="file"
                  id="file-uploadB"
                  onChange={handleUpload}
                  hidden
                />
                <label htmlFor="file-uploadB" className="col">

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                      <FontAwesomeIcon icon={faFileImport}
                        style={{ fontSize: 50 }}
                        className="iconDetail" />
                      <p>

                        ກົດເພື່ອອັບໂຫຼດ File
                      </p>
                    </div>
                </label>
              </div>
              <div style={{ height: 20 }}></div>
              {imageLoading ? (
                <div className='progress' style={{ height: 20 }}>
                  <div
                    className='progress-bar'
                    // role='progressbar'
                    style={{
                      width: `${imageLoading}%`,
                      backgroundColor: 'green'
                    }}
                    aria-valuenow={imageLoading}
                    aria-valuemin='0'
                    aria-valuemax='100'
                  >
                    {imageLoading}%
                  </div>
                </div>
              ) : (
                <div style={{ height: 20 }} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return {
    nameFile,
    setNameFile,
    buttonUploadAndShowFile,
  }
}
export default UploadFile;