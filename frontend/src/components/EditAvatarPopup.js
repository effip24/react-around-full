import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm.js";
import useFormAndValidation from "../utils/FormValidator.js";

const EditAvatarPopup = ({ isSending, isOpen, onClose, onAvatarUpdate }) => {
  const { values, handleChange, errors, isValid, resetForm, setValues, handleFileUpload, uploadState, setUploadState } =
    useFormAndValidation();

  useEffect(() => {
    resetForm();
    setValues({ link: "" });
    setUploadState("Upload");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onAvatarUpdate({
      avatar: values.link,
    });
  };

  return (
    <PopupWithForm
      name="avatar"
      title="Change profile picture"
      submit={isSending ? "Saving..." : "Save"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitButtonState={isValid ? "" : "popup__submit_inactive"}
    >
      <div className="popup__container">
        <div className="popup__uploader">
          <div className="popup__input-container">
            <input
            placeholder="image url"
              required
              name="link"
              type="url"
              avatarholder="Image link"
              className={`popup__input ${errors.link ? "popup__input_type_error" : ""}`}
              value={values.link || ""}
              onChange={handleChange}
            />
            <span className={`popup__input-error ${errors.link ? "popup__input-error_active" : ""}`}>
              {errors.link}
            </span>
          </div>
          <p className="popup__lable">OR</p>
          <input name="link" id="avatar-file" type="file" hidden accept="image/*" onChange={handleFileUpload} />
          <label className="popup__input popup__input_type_file" htmlFor="avatar-file">
            {uploadState}
          </label>
          <span className={`popup__input-error ${errors.file ? "popup__input-error_active" : ""}`}>{errors.file}</span>
        </div>
      </div>
    </PopupWithForm>
  );
};
export default EditAvatarPopup;
