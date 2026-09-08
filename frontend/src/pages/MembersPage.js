import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/api";

const API_URL = `${BASE_URL}/members`;

const MembersPage = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get(API_URL);
    setMembers(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Members</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Fee</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.phone}</td>
              <td>{m.fee}</td>
              <td>{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersPage;