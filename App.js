import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [genderFilter, setGenderFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;

      if (key === "firstName") {
        aValue = `${a.firstName} ${a.maidenName} ${a.lastName}`.toUpperCase();
        bValue = `${b.firstName} ${b.maidenName} ${b.lastName}`.toUpperCase();
      } else if (key === "age" || key === "id") {
        aValue = Number(a[key]);
        bValue = Number(b[key]);
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (type, value) => {
    if (type === "gender") {
      setGenderFilter(value);
    } else if (type === "country") {
      setCountryFilter(value);
    }
  };

  const getFilteredData = () => {
    return data.filter((item) => {
      const genderMatch = genderFilter ? item.gender === genderFilter : true;
      const countryMatch = countryFilter
        ? item.address.country === countryFilter
        : true;
      return genderMatch && countryMatch;
    });
  };

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getInitials = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const renderSortArrow = (key) => {
    return (
      <span>
        <i
          className={`fas fa-arrow-up ${
            sortConfig.key === key && sortConfig.direction === "ascending"
              ? "active"
              : ""
          }`}
        ></i>
        <i
          className={`fas fa-arrow-down ${
            sortConfig.key === key && sortConfig.direction === "descending"
              ? "active"
              : ""
          }`}
        ></i>
      </span>
    );
  };

  const uniqueGenders = useMemo(
    () => [...new Set(data.map((item) => item.gender))],
    [data]
  );
  const uniqueCountries = useMemo(
    () => [...new Set(data.map((item) => item.address.country))],
    [data]
  );

  return (
    <MDBContainer>
      <div style={{ marginTop: "100px" }}>
          <MDBCol size="10">
            <h2> Employee App</h2>
          </MDBCol>
          <MDBCol size="9">
            <MDBRow>
              <MDBCol size="6">
                <MDBDropdown>
                  <MDBDropdownToggle color="white" bordercolor="black">
                                                                         Filter by Gender
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem
                      onClick={() => handleFilterChange("gender", "")}
                    >
                      All
                    </MDBDropdownItem>
                    {uniqueGenders.map((gender, index) => (
                      <MDBDropdownItem
                        key={index}
                        onClick={() => handleFilterChange("gender", gender)}
                      >
                        {gender}
                      </MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBCol>
              <MDBCol size="6">
                <MDBDropdown>
                  <MDBDropdownToggle color="white" bordercolor="black">
                    Filter by Country
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem
                      onClick={() => handleFilterChange("country", "")}
                    >
                      All
                    </MDBDropdownItem>
                    {uniqueCountries.map((country, index) => (
                      <MDBDropdownItem
                        key={index}
                        onClick={() => handleFilterChange("country", country)}
                      >
                        {country}
                      </MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col" onClick={() => sortData("id")}>
                    ID {renderSortArrow("id")}
                  </th>
                  <th scope="col">Image</th>
                  <th scope="col" onClick={() => sortData("firstName")}>
                    Full Name {renderSortArrow("firstName")}
                  </th>
                  <th scope="col" onClick={() => sortData("age")}>
                    Age {renderSortArrow("age")}
                  </th>
                  <th scope="col">Designation</th>
                  <th scope="col">Location</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {getPaginatedData(getFilteredData()).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  getPaginatedData(getFilteredData()).map((item) => (
                    <tr key={item.id}>
                      <th scope="row">{item.id}</th>
                      <td>
                        <img
                          src={item.image}
                          alt={item.firstName}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>
                        {item.firstName} {item.maidenName} {item.lastName}
                      </td>
                      <td>{item.age}</td>
                      <td>{item.company.title}</td>
                      <td>
                        {item.address.state},{" "}
                        {getInitials(item.address.country)}
                      </td>
                    </tr>
                  ))
                )}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="12" className="text-center">
            <MDBBtn
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              color="primary"
              className="me-2"
            >
              Previous
            </MDBBtn>
            <span> Page {currentPage} </span>
            <MDBBtn
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={getFilteredData().length <= itemsPerPage * currentPage}
              color="primary"
              className="ms-2"
            >
              Next
            </MDBBtn>
          </MDBCol>
          </MDBRow>
      </div>
    </MDBContainer>
  );
}

export default App;
