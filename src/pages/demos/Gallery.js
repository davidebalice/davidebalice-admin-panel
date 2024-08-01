import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaDatabase, FaDesktop, FaTrash, FaUpload } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import PhotoModal from "../../components/Modal/PhotoModal";
import { Context } from "../../context/UserContext";
import NotPermission from "../Auth/notPermission";

const Gallery = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { userData, demoMode } = useContext(Context);
  const title = "Gallery demo";
  const [files, setFiles] = useState([]);
  const [typeGallery, setTypeGallery] = useState("frontend");
  const [gallery, setGallery] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleImageClick = (imgUrl, title) => {
    setSelectedImage(imgUrl);
    setSelectedTitle(title);
    setShowModal(true);
  };

  const closePhotoModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setSelectedTitle("");
  };

  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const { id } = useParams();
  const [forceUpdate, SetForceUpdate] = useState(0);
  const [formData, setFormData] = useState({
    imageCover: "",
  });

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleGalleryType = (type) => {
    setTypeGallery(type);
    if (type === "backend") {
      setGallery(formData.gallery_backend);
    } else {
      setGallery(formData.gallery_frontend);
    }
  };

  const onDeleteImage = (image) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this photo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (demoMode) {
          Swal.fire({
            title: "Demo mode",
            text: "Crud operations are not allowed",
            icon: "error",
            cancelButtonText: "Close",
          });
        } else {
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/api/delete/gallery/`,
              { id: id, image: image },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((response) => {
              SetForceUpdate((prevCount) => prevCount + 1);
            })
            .catch((error) => {
              console.error("Error:", error);

              Swal.fire("Error", error, "error");
            });
        }
      }
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/edit/demo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setFormData(response.data.demo);
        if (typeGallery == "frontend") {
          setGallery(response.data.demo.gallery_frontend);
        } else {
          setGallery(response.data.demo.gallery_backend);
        }
        //handleGalleryType("frontend");
        //SetForceUpdate((prevCount) => prevCount + 1);
      })
      .catch((error) => {
        console.error("Error:", error);

        Swal.fire("Error", error, "error");
      });
  }, [forceUpdate]);

  const submitForm = (e) => {
    e.preventDefault();
    if (demoMode) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      formData.append("type", typeGallery);
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/api/demo/gallery/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setFormData({
            ...formData,
            imageCover: response.data.imageCover,
          });
          SetForceUpdate((prevCount) => prevCount + 1);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      {userData && formData ? (
        <div className="page">
          <div class="row">
            <Link to={`/demos`}>
              <div class="backButton col-sm-4 col-md-4 col-lg-3">
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="backButtonIcon"
                />
                <div class="card-body d-flex px-1">Back</div>
              </div>
            </Link>
          </div>

          <PhotoModal
            show={showModal}
            imgUrl={selectedImage}
            title={selectedTitle}
            closePhotoModal={closePhotoModal}
          />

          <Breadcrumb title={title} brad={brad} />
          <div className="card">
            <div className="card-body">
              <div className="buttonGalleryContainer">
                <button
                  className="backButton"
                  onClick={() => handleGalleryType("frontend")}
                >
                  <FaDesktop />
                  Gallery frontend
                </button>
                <button
                  className="backButton"
                  onClick={() => handleGalleryType("backend")}
                >
                  <FaDatabase />
                  Gallery backend
                </button>
              </div>
              <h3 className="mb-4 mt-3">Gallery {typeGallery}</h3>
              <div className="formContainer">
                <label>
                  <b>Select file</b>
                </label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  required
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-md-6 mt-3"></div>
              <button
                onClick={submitForm}
                className="btn btn-sm saveButton mt-3"
              >
                <FaUpload />
                Upload
              </button>
              <br /> <br />
              <div className="gallery">
                {gallery &&
                  gallery.map((image, index) => (
                    <div
                      key={index}
                      className="col-sm-4 col-md-3 col-12 galleyItem"
                    >
                      <div
                        className="galleryDelete"
                        onClick={() => onDeleteImage(image)}
                      >
                        <FaTrash className="galleryDeleteIcon" />
                      </div>
                      <img
                        key={`${"img"}index`}
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/demo/gallery/${image}`}
                        alt={`${index}`}
                        className="galleyImg"
                        onClick={() =>
                          handleImageClick(
                            `${process.env.REACT_APP_API_BASE_URL}/api/demo/gallery/${image}`,
                            image.title
                          )
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  ))}
              </div>
              <br /> <br />
            </div>
          </div>
        </div>
      ) : (
        <NotPermission />
      )}
    </>
  );
};

export default Gallery;
