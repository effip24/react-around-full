class CloudinaryApi {
  /** constructor of Auth class.
   * @param  baseUrl - the URL to make the request to.
   */
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  uploadImage(data) {
    return fetch(this._baseUrl + "/dac0c068e/image/upload", {
      method: "POST",
      body: data,
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  deleteImage(data) {
    return fetch(this._baseUrl + "/dac0c068e/image/destroy", {
      method: "POST",
      body: data,
    }).then((res) => {
      return this._checkResponse(res);
    });
  }
}
const cloudinaryApi = new CloudinaryApi({
  baseUrl: "https://api.cloudinary.com/v1_1",
});

export default cloudinaryApi;
