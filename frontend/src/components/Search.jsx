import {
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControl,
  TextField,
} from "@mui/material";
function Search(props) {
  return (
    <Box sx={{ minWidth: 0, display: "flex" }}>
      <FormControl fullWidth sx={{ marginRight: 0 }}>
        <InputLabel
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            color: props.searchCriteria !== "" ? "white" : "black",
          }}
        >
          Search Criteria
        </InputLabel>
        <Select
          sx={{
            minWidth: 200,
            maxWidth: 230,
            fontWeight: "bold",
            borderColor: "white",
            background: "#9499a1",
          }}
          value={props.searchCriteria}
          label="Search Criteria"
          onChange={(e) => props.setSearchCriteria(e.target.value)}
        >
          <MenuItem value={""}>None</MenuItem>
          <MenuItem value={"scrumMasterName"}>Scrum Master Name</MenuItem>
          <MenuItem value={"Developers"}>Developer Name</MenuItem>
        </Select>
      </FormControl>

      <TextField
        disabled={props.searchCriteria === ""}
        sx={{
          color: "black",
          background: "#9499a1",
          fontWeight: "bold",
        }}
        value={props.searchFilter}
        onChange={(e) => props.updateSearchFilter(e.target.value)}
      ></TextField>
    </Box>
  );
}

export default Search;
