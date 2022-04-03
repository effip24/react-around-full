import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm.js";
import useFormAndValidation from "../utils/FormValidator.js";

const AddPlacePopup = ({ isSending, isOpen, onClose, onAddPlaceSubmit }) => {
  const { values, handleChange, errors, isValid, resetForm, setValues, handleFileUpload, uploadState, setUploadState } =
    useFormAndValidation();

  useEffect(() => {
    resetForm();
    setValues({ name: "", link: "" });
    setUploadState("Upload");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddPlaceSubmit(values);
  };

  return (
    <PopupWithForm
      name="add"
      title="New place"
      submit={isSending ? "Saving..." : "Save"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitButtonState={isValid ? "" : "popup__submit_inactive"}
    >
      <div className="popup__container">
        <div className="popup__input-container">
          <input
            required
            minLength="1"
            maxLength="30"
            name="name"
            type="text"
            placeholder="Title"
            className={`popup__input  ${errors.name ? "popup__input_type_error" : ""}`}
            value={values.name || ""}
            onChange={handleChange}
          />
          <span className={`popup__input-error ${errors.name ? "popup__input-error_active" : ""}`}>{errors.name}</span>
        </div>

        <div className="popup__uploader">
          <input
            required
            name="link"
            type="url"
            placeholder="Image link"
            className={`popup__input  ${errors.link ? "popup__input_type_error" : ""}`}
            value={values.link || ""}
            onChange={handleChange}
          />
          <p className="popup__lable">OR</p>
          <input name="link" id="place-file" type="file" hidden accept="image/*" onChange={handleFileUpload} />
          <label className="popup__input popup__input_type_file" htmlFor="place-file">
            {uploadState}
          </label>
          <span className={`popup__input-error ${errors.file ? "popup__input-error_active" : ""}`}>{errors.file}</span>
        </div>
        <span className={`popup__input-error ${errors.link ? "popup__input-error_active" : ""}`}>{errors.link}</span>
      </div>
    </PopupWithForm>
  );
};
export default AddPlacePopup;
