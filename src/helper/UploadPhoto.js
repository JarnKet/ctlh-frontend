import React, { useState } from "react";
import { PRESIGNED_URL } from "../apollo/uploadFile";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Consts from "../consts/";

const UploadPhoto = () => {
  const [widthPhoto, setWidthPhoto] = useState(200);
  const [heightPhoto, setHeightPhoto] = useState(200);
  const [uploadPhoto] = useMutation(PRESIGNED_URL);
  const [namePhoto, setNamePhoto] = useState();
  const [imageLoading, setImageLoading] = useState();
  const handleUpload = async (event) => {
    setImageLoading("");
    try {
      let fileDataBoole = event?.target?.files[0];
      let fileDatatype = event?.target?.files[0]?.type;
      let imageName = uuidv4() + "." + fileDatatype.split("/")[1].toString();

      let checkFileUpload = fileDatatype.split("/")[0] !== "application";
      if (checkFileUpload === false) {
        Swal.fire({
          icon: "error",
          title: "ກະລຸນາເລືອກຮູບພາບ",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      const resUploadPhoto = await uploadPhoto({
        variables: {
          fileName: imageName,
          mimeType: "image/" + imageName.split(".")[imageName.split(".").length - 1],
        },
      });

      await axios({
        method: "put",
        url: resUploadPhoto.data.preSignedUrl.url,
        data: fileDataBoole,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },

        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageLoading(percentCompleted);
        },
      });
      setNamePhoto(imageName);
    } catch (error) {}
  };
  const ImageThumb = () => {
    return (
      <img
        src={Consts.URL_FOR_SHOW_PHOTO + namePhoto}
        alt={namePhoto}
        style={{
          height: heightPhoto,
          width: widthPhoto,
        }}
      />
    );
  };

  const buttonUploadAndShowPhoto = () => {
    return (
      <div>
        <input type="file" id="file-upload" onChange={handleUpload} hidden accept="image/png, image/gif, image/jpeg, image/jpg" />
        <label htmlFor="file-upload">
          <div className="box-upload-image">{namePhoto ? <ImageThumb image={namePhoto} /> : <div> + Upload </div>}</div>
        </label>

        {imageLoading ? (
          <div className="progress" style={{ height: 10, width: 180 }}>
            <div
              role="progressbar"
              aria-label={`${imageLoading}%`}
              className="progress-bar"
              style={{ width: `${imageLoading}%`, backgroundColor: "green" }}
              aria-valuenow={imageLoading}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {imageLoading}%
            </div>
          </div>
        ) : (
          <div style={{ height: 20 }} />
        )}
      </div>
    );
  };

  return {
    namePhoto,
    setNamePhoto,
    setWidthPhoto,
    setHeightPhoto,
    buttonUploadAndShowPhoto,
  };
};
export default UploadPhoto;
