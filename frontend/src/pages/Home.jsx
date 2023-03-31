import { Button, AppBar, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import EntryForm from "../components/EntryForm";
import Search from "../components/Search";

function Home() {
  useEffect(() => {
    // Get the products from the API on page load
    getProducts();
  }, []);

  async function getProducts() {
    // Call API to return products and set state
    const products = await axios.get("http://localhost:3000/api/products");
    if (products.status === 200) {
      setAllProducts(products.data.products);
      // initially the filtered products is the entire list of products
      setFilteredProducts(products.data.products);
    } else {
      alert("Error getting products");
    }
  }

  const [allProducts, setAllProducts] = useState([]);
  const [openEntry, setOpenEntry] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // product Id will not be a field shown on the form but the field needs to be kept track of for editing an entry
  // new entries will have a blank productId that will be overwritten
  const [entry, setEntry] = useState({
    productId: "",
    "Product Name": "",
    "Scrum Master": "",
    "Product Owner": "",
    "Developer Names (comma separated)": [],
    "Start Date": "",
    Methodology: "",
  });
  
  const columnTitles = [
    "Product Number",
    "Product Name",
    "Scrum Master",
    "Product Owner",
    "Developer Names",
    "Start Date",
    "Methodology",
  ];


  const handleEntryChange = (inputName, inputValue) => {
    // updates the entry state, called via props in AddEntryForm.jsx
    setEntry({
      ...entry,
      [inputName]: inputValue,
    });
  };

  const openEntryForm = (typeOfEntry) => {
    // entry type is either add or edit
    setEntryType(typeOfEntry);
    setOpenEntry(true);
  };

  const closeEntryForm = () => {
    // clears the form state and closes modal
    setOpenEntry(false);
    setEntry({
      productId: "",
      "Product Name": "",
      "Scrum Master": "",
      "Product Owner": "",
      "Developer Names (comma separated)": [],
      "Start Date": "",
      Methodology: "",
    });
  };

  const submitEntry = async () => {
    // handles both submitting a new product and updating an existing product

    // split the developer input on commas and trim the input to remove leading or trailing whitespace
    setOpenEntry(false);
    const developers = entry["Developer Names (comma separated)"].split(",");
    const developersTrimmed = developers.map((dev) => {
      return dev.trim();
    });

    if (entryType === "add") {
      // adding a new entry has to be handelled differently than editing an existing entry
      // payload for the api request
      const newProduct = {
        productName: entry["Product Name"],
        scrumMasterName: entry["Scrum Master"],
        productOwnerName: entry["Product Owner"],
        Developers: developersTrimmed,
        startDate: entry["Start Date"],
        methodology: entry["Methodology"],
      };
      // post it to the API
      const response = await axios.post(
        "http://localhost:3000/api/product",
        newProduct
      );
      if (response.status === 200) {
        // if the server responded 200, add the element to the frontend list of products, server will add it to the JSON file so it will persist
        // server will calculate the product Id and return it to the frontend as well
        const productId = response.data["productId"];
        newProduct["productId"] = productId;
        const updatedProducts = [...allProducts, newProduct];
        setAllProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } else {
        alert("Error submitting new product");
      }
    } else {
      // an edit was submitted
      // payload for the api request, however this time the productId is passed so it will be updated
      const editedProduct = {
        productId: entry["productId"],
        productName: entry["Product Name"],
        scrumMasterName: entry["Scrum Master"],
        productOwnerName: entry["Product Owner"],
        Developers: developersTrimmed,
        startDate: entry["Start Date"],
        methodology: entry["Methodology"],
      };

      const response = await axios.put(
        "http://localhost:3000/api/edit",
        editedProduct
      );
      if (response.status === 200) {
        // if the server responded 200, update this element on the frontend
        const idxOfEditedProduct = allProducts.findIndex(
          (product) => product.productId === entry["productId"]
        );
        if (idxOfEditedProduct === -1) {
          // The product was not found on the frontend
          alert("Could not find product to update");
          return;
        }
        // update the list on the frontend to show the edits made
        const products = allProducts;
        products[idxOfEditedProduct] = editedProduct;
        const updatedProducts = [...products];
        setAllProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
      // refresh the filter after an add or edit to show the changes
      setSearchFilter("");
      setSearchCriteria("");
      closeEntryForm();
    }
  };

  const editEntry = (productInfo) => {
    // convert the list of developers into a comma separated string
    // set the entry state to this rows' entry
    // called from via props from TableComponent.jsx
    const developers = productInfo["Developers"].toString();
    setEntry({
      productId: productInfo["productId"],
      "Product Name": productInfo["productName"],
      "Scrum Master": productInfo["scrumMasterName"],
      "Product Owner": productInfo["productOwnerName"],
      "Developer Names (comma separated)": developers,
      "Start Date": productInfo["startDate"],
      Methodology: productInfo["methodology"],
    });
    openEntryForm("edit");
  };

  // everytime the search criteria is changed the filter has to be tried again for the other critera
  useEffect(() => {
    updateSearchFilter(searchFilter);
  }, [searchCriteria]);

  const updateSearchFilter = (filter) => {
    // if there is a search criteria currently being used filter the list of products and only return those that are relevant
    // called via props from Search.jsx
    setSearchFilter(filter);
    if (searchCriteria === "scrumMasterName") {
      const filteredListOfProducts = allProducts.filter((product) => {
        return product["scrumMasterName"]
          .toLowerCase()
          .includes(filter.toLowerCase());
      });
      setFilteredProducts(filteredListOfProducts);
    } else if (searchCriteria === "Developers") {
      const filteredListOfProducts = allProducts.filter((product) => {
        return product["Developers"].some((developerName) =>
          developerName.toLowerCase().includes(filter.toLowerCase())
        );
      });
      setFilteredProducts(filteredListOfProducts);
    } else {
      // if the criteria was changed to none then reset the filtered products to all the products
      // and reset the search filter state to an empty string
      setFilteredProducts(allProducts);
      setSearchFilter("");
    }
  };

  return (
    <div>
      <EntryForm
        openEntry={openEntry}
        closeEntryForm={closeEntryForm}
        handleEntryChange={handleEntryChange}
        submitEntry={submitEntry}
        entryType={entryType}
        entry={entry}
      ></EntryForm>
      <div style={{ flexGrow: 1, marginBottom: 20 }}>
        <AppBar position="static">
          <Toolbar sx={{ background: "#2B2E41" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              textAlign="center"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              IMB Products
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "80%", padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Search
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
              searchFilter={searchFilter}
              updateSearchFilter={updateSearchFilter}
            ></Search>
            <Button
              sx={{ maxHeight: 1 }}
              onClick={() => openEntryForm("add")}
              variant="contained"
              startIcon={<AddIcon />}
              color="success"
            >
              Add Entry
            </Button>
          </div>
          <Table
            columnTitles={columnTitles}
            // allProducts={allProducts}
            products={filteredProducts}
            editEntry={editEntry}
          ></Table>
        </div>
      </div>
    </div>
  );
}

export default Home;
