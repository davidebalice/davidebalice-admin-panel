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
import { FaDatabase, FaDesktop, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import angular from "../../assets/img/angular.png";
import javascript from "../../assets/img/javascript.png";
import laravel from "../../assets/img/laravel.png";
import node from "../../assets/img/node.png";
import nophoto from "../../assets/img/nophoto.jpg";
import php from "../../assets/img/php.png";
import react from "../../assets/img/react.png";
import spring from "../../assets/img/spring.png";
import typescript from "../../assets/img/typescript.png";
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

  const getTechnologyIcon = (tech) => {
    switch (tech) {
      case "react":
        return react;
      case "angular":
        return angular;
      case "spring":
        return spring;
      case "node":
        return node;
      case "laravel":
        return laravel;
      case "php":
        return php;
      case "javascript":
        return javascript;
      case "typescript":
        return typescript;

      default:
        return react;
    }
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
                      {data.imageCover ? (
                        <div
                          className="demoCardCover"
                          style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/demo/cover/${data.imageCover})`,
                          }}
                        >
                          <div className="tecnologyContainer">
                            {data.tecnology &&
                              tecnologyFunc(data.tecnology).map(
                                (tech, index) => (
                                  <div key={index} className="tecnologyIcon">
                                    <img
                                      className="tecnologyImg"
                                      src={getTechnologyIcon(tech)}
                                      alt={tech}
                                    />
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="demoCardCover"
                          style={{
                            backgroundImage: `url(${nophoto})`,
                          }}
                        ></div>
                      )}

                      <div className="demoTextContainer">
                        <p className="demoDetailColumn">
                          <span className="demoDetailTitle">{data.title}</span>
                          <span className="demoDetailSubTitle">
                            {data.subtitle}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="demoCardLinkContainer">
                      {data.frontend && (
                        <a
                          href={data.frontend}
                          target="_blank"
                          title="frontend link"
                          rel="noreferrer"
                          className="linkButtonLink"
                        >
                          <div className="linkButton linkButtonFrontend">
                            <FaDesktop />
                            <span>Frontend</span>
                          </div>
                        </a>
                      )}

                      {data.backend && (
                        <a
                          href={data.backend}
                          target="_blank"
                          title="frontend link"
                          className="linkButtonLink"
                          rel="noreferrer"
                        >
                          <div className="linkButton linkButtonBackend">
                            <FaDatabase />
                            <span>Backend</span>
                          </div>
                        </a>
                      )}

                      {data.github && (
                        <a
                          href={data.github}
                          target="_blank"
                          title="frontend link"
                          rel="noreferrer"
                          className="linkButtonLink"
                        >
                          <div className="linkButton linkButtonGithub">
                            <FaGithub />
                            <span>Github</span>
                          </div>
                        </a>
                      )}
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
