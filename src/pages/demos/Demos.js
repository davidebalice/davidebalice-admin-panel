import {
  faCirclePlus,
  faListCheck,
  faNoteSticky,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumb";
import Loading from "../../components/loading";
import { Context } from "../../context/UserContext";

const Demos = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/api/demos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setData(response.data.demos);
        setLoading(false);
        console.log(response.data.demos);
      })
      .catch((error) => {
        console.error("Error during api call:", error);
      });
  }, [token]);

  const tecnologyFunc = (str) => {
    return str.split(",").map((tech) => tech.trim());
  };

  const title = "Demos";

  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  return (
    <>
      <div className="page">
        <Breadcrumb title={title} brad={brad} />

        {loading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            <div className="row">
              <Link to={`/add/demo/`}>
                <div className="addButton col-sm-4 col-md-4 col-lg-3">
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="addButtonIcon"
                  />
                  <div className="card-body d-flex px-1">Add demo</div>
                </div>
              </Link>
            </div>

            <div className="row">
              {data.map((data, i) => (
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-xl-3 "
                  key={`demo${i}`}
                >

                  <div className="demoCard">
                    <div>
                      <div
                        className="demoCardCover"
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/demo/cover/${data.imageCover}`,
                        }}
                      ></div>

                      <div className="demoMembersContainer">
                        <p className="demoDetailColumn">
                          <p className="demoDetailMidTitle">Tecnology:</p>

                          {tecnologyFunc(data.tecnology).map((tech, index) => (
                            <li key={index}>{tech}</li>
                          ))}
                        </p>
                      </div>

                      <div className="demoCardTitle">
                        <p>{data.name}</p>
                        <div className="demoCardLastUpdate">
                          last update
                          <br />
                          <b>{data.lastUpdate}</b>
                        </div>
                      </div>
                    </div>

                    <div className="demoCardButtonContainer">
                      <Link to={`/cover/demo/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="tooltip">Photo Cover</Tooltip>
                          }
                        >
                          <button className="btn btn-primary btn-sm demoCardButton">
                            <FontAwesomeIcon
                              icon={faNoteSticky}
                              className="demoCardIcon"
                            />
                            <p className="demoCardButtonTitle">Cover</p>
                          </button>
                        </OverlayTrigger>
                      </Link>

                      <Link to={`/edit/demo/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="tooltip">Edit demo</Tooltip>
                          }
                        >
                          <button className="btn btn-primary btn-sm demoCardButton">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="demoCardIcon"
                            />
                            <p className="demoCardButtonTitle">Edit</p>
                          </button>
                        </OverlayTrigger>
                      </Link>

                      <Link to={`/demo/gallery/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip className="tooltip">Tasks</Tooltip>}
                        >
                          <button className="btn btn-primary btn-sm demoCardButton">
                            <div className="text-black">
                              <FontAwesomeIcon
                                icon={faListCheck}
                                className="demoCardIcon"
                              />
                              
                            </div>

                            <p className="demoCardButtonTitle">Gallery</p>
                          </button>
                        </OverlayTrigger>
                      </Link>

                      <Link to={`/demo/delete/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="tooltip">Delete demo</Tooltip>
                          }
                        >
                          <button className="btn btn-primary btn-sm demoCardButton bg-red">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="demoCardIcon"
                            />
                            <p className="demoCardButtonTitle">Delete</p>
                          </button>
                        </OverlayTrigger>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Demos;
