import axios from "axios";
import React, { useEffect } from "react";
import "./Stats.css";
import "react-calendar/dist/Calendar.css";

import {
  Button,
  Card,
  Col,
  Container,
  Nav,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets } from "../ticket-list/ticketsAction";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";

import BarChart from "../../components/charts/BarChart";

import jsPDF from "jspdf";
require("jspdf-autotable");

const Stats = () => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${process.env.NOTION_AUTH_TOKEN}`;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  let currentDate = new Date();
  let time =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();



  const { searchTicketList, isLoading, error } = useSelector(
    (state) => state.tickets
  );
  if (isLoading) return <h3>Loading ...</h3>;
  if (error) return <h3>{error}</h3>;

  const generateReport = () => {
    var doc = new jsPDF("p", "pt", "a4");
    //table
    searchTicketList.map((ticket) => {
      doc.autoTable({
        head: [
          [
            "Ticket ID",
            "Ticket Title",
            "Inquiry Type",
            "Open At",
            "Opened By",
            "Description",
            "Ticket Status",
          ],
        ],
        body: [
          [
            ticket._id,
            ticket.subject,
            ticket.inquiryType,
            ticket.openAt,
            ticket.conversations[0].sender,
            ticket.conversations[0].message,
            ticket.status,
          ],
        ],
      });
    });
    doc.save("TicketReport.pdf");
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <PageBreadcrumb page="Statistics" />
          </Col>
        </Row>
        <Card>
          <div id="time" style={{ display: "flex", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                right: "0",
                padding: "5px",
              }}
            >
              <b>TIME: </b>
              {time} HH:MM:SS
            </div>
          </div>
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey="#first">
              <Nav.Item>
                <Nav.Link href="#first">Ticket Statistics</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Card.Title>Power-Zone | Statistics</Card.Title>
            <Card.Text>
              View all your Statistics at one place, fetched from your
              dashboard.
            </Card.Text>

            <Button
              variant="primary"
              onClick={() => {
                generateReport();
              }}
            >
              Generate Report
            </Button>

            <Row>
              <Col className="text-center mt-0 mb-0">
                <Container id="buttonContainer">
                  <Row>
                    <BarChart
                      data={searchTicketList}
                      title="Tickets Logged"
                      className="mb-2"
                      color="rgb(255, 204, 204)"
                    />
                    <hr />
                  </Row>
                </Container>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <br />
      </Container>
    </>
  );
};

export default Stats;
