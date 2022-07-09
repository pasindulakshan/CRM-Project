import React from "react";
import { useSelector } from "react-redux";

import { Button, Table } from "react-bootstrap";

import { Link } from "react-router-dom";

const QRCode = require("qrcode.react");

export const TicketTable = ({ dash }) => {
  const { searchTicketList, isLoading, error } = useSelector(
    (state) => state.tickets
  );
  if (isLoading) return <h3>Loading ...</h3>;
  if (error) return <h3>{error}</h3>;


  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>QR</th>
            <th>#Ticket ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Opened Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {searchTicketList.length ? (
            searchTicketList.map((row, index) => (
              <tr key={row._id}>
                <td>
                  <div>
                    <QRCode
                      id="qrcode"
                      style={{ width: "4rem", height: "4rem" }}
                      value={row.subject}
                    />
                  </div>
                </td>
                <td style={{ display: "flex" }}>
                  <div>{row._id}</div>
                </td>

                <td>{row.subject}</td>
                <td>{row.inquaryType}</td>
                {row.status === "Closed" ? (
                  <td style={{ backgroundColor: "#FF9DA2" }}>{row.status}</td>
                ) : (
                  <td style={{ backgroundColor: "#93CA5B" }}>{row.status}</td>
                )}
                <td>{row.openAt && new Date(row.openAt).toLocaleString()}</td>
                <td>
                  <Link to={`/ticket/${row._id}`}>
                    <Button variant="primary">View</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No ticket to show{" "}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* <Link to="#">
        <Button className="mt-2" variant="dark" style={{ float: "right" }}>
          Download Ticket Data
        </Button>
      </Link> */}
    </>
  );
};
