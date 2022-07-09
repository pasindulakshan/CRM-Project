import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import {
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  Card,
  Modal,
} from "react-bootstrap";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp";
import tickets from "../../assets/data/dummy-tickets.json";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { Link } from "react-router-dom";
import ChatBot from "react-simple-chatbot";

import { fetchAllTickets } from "../ticket-list/ticketsAction";
import "./Dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GrAdd } from "react-icons/gr";
import { FaListAlt } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";
import axios from "axios";
import { SiSlack } from "react-icons/si";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Dashboard = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [value, onChange] = useState(new Date());
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState();
  const [latestOpen, setLatestOpen] = useState(null);
  const [latestClosed, setLatestClosed] = useState(null);

  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!tickets.length) {
      dispatch(fetchAllTickets());
    }
    getLatestTickets();
  }, [tickets, dispatch, date]);

  const toggleChatBox = () => {
    setToggle(!toggle);
  };

  toast.configure();

  const notify = () => {
    toast.dark("Workspace successfully synced!");
  };

  const postUrl = "http://localhost:3001/v1/slack/sync";

  const syncSlack = () => {
    axios
      .post(postUrl)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica",
    headerBgColor: "#292b2c",
    headerFontColor: "#fff",
    headerFontSize: "20px",
    botBubbleColor: "#292b2c",
    botFontColor: "#fff",
    userBubbleColor: "#f0ad4e",
    userFontColor: "#000",
  };

  let currentDate = new Date();
  let time =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  const pendingTickets = tickets.filter((row) => row.status !== "Closed");
  const totalTickets = tickets.length;

  const openTickets = tickets.filter((row) => row.status !== "Pending");
  let last = openTickets.pop();
  const showCalendar = () => {
    setCalendar(!calendar);
  };
  const [nowTime, setNowtime] = useState(value);

  const steps = [
    {
      id: "1",
      message: "Welcome to Power-Zone Gym, what do you want to do today?",
      trigger: "2",
    },
    {
      id: "2",
      options: [
        { value: 1, label: "Add new Ticket", trigger: "3" },
        { value: 2, label: "View Dashboard", trigger: "4" },
        { value: 3, label: "View latest tickets", trigger: "5" },
        { value: 4, label: "Go to profile", trigger: "6" },
      ],
    },
    {
      id: "3",
      component: (
        <Button id="chatButton" variant="link" block>
          <Link
            to="/add-ticket"
            style={{
              textDecoration: "none",
            }}
          >
            Add New Ticket
          </Link>
        </Button>
      ),
      end: true,
    },
    {
      id: "4",
      component: (
        <Button id="chatButton" variant="light">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      ),
      end: true,
    },
    {
      id: "5",
      component: <div>LATEST TICKETS</div>,
      end: true,
    },
    {
      id: "6",
      component: (
        <Button variant="light">
          <Link to="/profile">Profile</Link>
        </Button>
      ),
      end: true,
    },
  ];

  const getLatestTickets = async () => {
    const latestTickets = { tickets };

    // let closedTickets = [];

    // for (const tkt in latestTickets.tickets) {
    //   if (latestTickets.tickets[tkt].status === "Closed") {
    //     closedTickets.push(latestTickets.tickets[tkt]);
    //   }
    // }
    // const lastClosed = closedTickets[0];
    setLatestClosed(tickets[0]);
  };

  function TicketModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header id="modalCustom" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            All Tickets
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TicketTable redirect="dash" />
        </Modal.Body>
        <Modal.Footer id="modalCustom">
          <Button variant="outline-light" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <Container>
        <Jumbotron id="jumbotron">
          <h3>Welcome to Power-Zone CRM</h3>
          <p>
            You can add new tickets, view all tickets via Power-Zone CRM
            Dashboard
          </p>
        </Jumbotron>

        <Row>
          <Col>
            <PageBreadcrumb page="Dashboard" />
          </Col>
        </Row>

        <Row>
          <div id="dashboardCards">
            <Col>
              <Card id="dashboardCard" border="dark">
                <Card.Body>
                  <Card.Title>Total tickets:</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Total Log Count
                  </Card.Subtitle>
                  <Card.Text>{totalTickets}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card id="dashboardCard" border="dark">
                <Card.Body>
                  <Card.Title>Pending tickets:</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Unresolved
                  </Card.Subtitle>
                  <Card.Text>{pendingTickets.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card id="dashboardCard" border="dark">
                <Card.Body>
                  <Card.Title>View Ticket table:</Card.Title>

                  <Card.Text>
                    <Button
                      onClick={() => setModalShow(true)}
                      variant="outline-light"
                      style={{ float: "right" }}
                    >
                      <FaListAlt /> {"  "} View
                    </Button>

                    <TicketModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </div>
        </Row>
      </Container>

      <div id="chatbot">
        <div id="chatbotOnline">
          <RiRadioButtonLine /> <span>ONLINE</span>{" "}
        </div>

        <Button variant="dark" onClick={toggleChatBox} id="chatbotHeader">
          Power-Zone Assistant
        </Button>
        <ThemeProvider theme={theme}>
          {toggle ? <ChatBot steps={steps} /> : ""}
        </ThemeProvider>
      </div>
    </>
  );
};
