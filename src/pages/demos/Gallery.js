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
  const { userData, demo } = useContext(Context);
  const title = "Edit demo";
  const [files, setFiles] = useState([]);
  const [typeGallery, setTypeGallery] = useState("frontend");
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const { id } = useParams();
  const [formData, setFormData] = useState({
    imageCover: "",
  });

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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
        console.log("response.data");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);

        Swal.fire("Error", error, "error");
      });
  }, []);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (demo) {
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
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/api/demo/photo/${id}`,
          { images: formData },
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

          <button onClick={() => setTypeGallery("frontend")}>frontend</button>
          <button onClick={() => setTypeGallery("backend")}>backend</button>

          {typeGallery}

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
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/api/demo/cover/${formData.imageCover}`}
                style={{ maxWidth: "400px" }}
                alt=""
              />
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
