import {
  faCircleChevronLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import { Context } from "../../context/UserContext";
import NotPermission from "../Auth/notPermission";

const Gallery = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { userData, demoMode } = useContext(Context);
  const title = "Edit demo";
  const [files, setFiles] = useState([]);
  const [typeGallery, setTypeGallery] = useState("frontend");
  const [gallery, setGallery] = useState([]);
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
        setGallery(response.data.demo.gallery_frontend);
        handleGalleryType("frontend");
        SetForceUpdate(1);
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

          <button onClick={() => handleGalleryType("frontend")}>
            frontend
          </button>
          <button onClick={() => handleGalleryType("backend")}>backend</button>

          <Breadcrumb title={title} brad={brad} />
          <div className="card">
            <div className="card-body">
              <div className="formContainer">
                <label for="photo">
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
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  className="saveButtonIcon"
                />{" "}
                Save
              </button>
              <br /> <br />
              <h1>Gallery</h1>
              <div className="gallery">
                {gallery &&
                  gallery.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API_BASE_URL}/api/demo/gallery/${image}`}
                      alt={`${index}`}
                    />
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
