import { useState, useCallback } from "react";
import cloudinaryApi from "../utils/CloudinaryApi";

function useFormAndValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [uploadState, setUploadState] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: e.target.validationMessage });
    setIsValid(e.target.closest("form").checkValidity());
  };

  const handleFileUpload = (e) => {
    const { name } = e.target;
    const files = e.target.files;
    const data = new FormData();

    data.append("file", files[0]);
    data.append("upload_preset", "zlwnk5wk");

    setUploadState("uploading...");

    cloudinaryApi
      .uploadImage(data)
      .then((img) => {
        setValues({ ...values, [name]: img.secure_url });
        setIsValid(e.target.closest("form").checkValidity());
      })
      .catch((err) => {
        console.log(err);
        setErrors({ ...errors, ["file"]: `${err} incorrect file type, please upload image only!` });
      })
      .finally(() => {
        setUploadState("done...");
      });
    e.target.value = null;
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    setValues,
    setIsValid,
    handleFileUpload,
    uploadState,
    setUploadState,
  };
}
export default useFormAndValidation;
