import React, { useEffect, useState } from "react";
import "./Profile.css";
import { CSVLink } from "react-csv";
import ChatBot from "react-simple-chatbot";

import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Image,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import axios from "axios";

const Profile = () => {
  const preset = "ml_default";
  const url = "https://api.cloudinary.com/v1_1/satyasri/image/upload";
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(
    "https://i.ibb.co/1m0pj6k/Profile-Placeholder-image-Gray-silhouette-no-photo-of-a-person-on-the-avatar-The-default-pic-is-used.jpg"
  );
  const userData = user;
  const [bio, setBio] = useState("BIO");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [file, setFile] = useState(null);

  const [imageData, setImageData] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false);

  useEffect(() => {
    setBio("Support Staff");
  }, []);

  const headers = [
    { label: "Employee ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Profile", key: "bio" },
  ];

  const data = [
    {
      id: userData.user._id,
      name: userData.user.name,
      email: userData.user.email,
      profile: bio,
    },
  ];

  const csvData = {
    data: data,
    headers: headers,
    filename: `[${userData.user.name}]Power-Zone GymProfilePhoto.csv`,
  };

  const uploadFile = async (e) => {
    let formData = new FormData();
    const fileSelector = e.target.files[0];

    formData.append("file", fileSelector);

    try {
      let imageUrl;
      const uploadedImage = await axios
        .post("localhost:3001/v1/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          imageUrl = res.data.secure_url;
        });

      setProfilePhoto(imageUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <PageBreadcrumb page="Profile" />
          </Col>
        </Row>

        <div id="profileContainer">
          <Row>
            <Col>
              <Card
                id="profileCard"
                bg="dark"
                text="white"
                style={{ width: "18rem" }}
              >
                <Card.Header>
                  <div style={{ display: "flex", position: "relative" }}>
                    <h6 style={{ fontSize: "1.2rem" }}>{user.user.name}</h6>
                    <CgProfile
                      style={{
                        width: "30px",
                        height: "30px",
                        position: "absolute",
                        right: "0",
                      }}
                    />
                  </div>
                </Card.Header>
                {loading ? (
                  <h3>Loading ...</h3>
                ) : (
                  <Image id="profilePhoto" src={profilePhoto} roundedCircle />
                )}

                <Button
                  onClick={() => setShowUploadButton(!showUploadButton)}
                  id="upload"
                  variant="outline-light"
                >
                  Change profile image
                </Button>

                {showUploadButton ? (
                  <div style={{ display: "flex" }}>
                    <input
                      id="photo"
                      type="file"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                ) : (
                  ""
                )}
              </Card>
            </Col>
            <Col>
              <div>
                <Card
                  id="profileDetails"
                  bg="white"
                  text="dark"
                  style={{ width: "45rem" }}
                  className="ml-4"
                >
                  <Card.Header>
                    <div>
                      <b>Profile Details</b>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th>ID</th>
                          <td>{user.user._id}</td>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <td>{user.user.name}</td>
                        </tr>
                        <tr>
                          <th>Profile</th>
                          <td>Manager</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{user.user.email}</td>
                        </tr>
                        <tr>
                          <th>Bio</th>
                          <td>{bio}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
                <Link to="/dashboard">
                  <Button id="homeButton" variant="dark">
                    Home
                  </Button>
                </Link>
                <Button id="downloadButton" variant="outline-dark">
                  <CSVLink id="csvlink" {...csvData}>
                    {" "}
                    Download Profile Details (CSV)
                  </CSVLink>
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Profile;
