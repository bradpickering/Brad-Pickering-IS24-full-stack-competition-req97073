import {
  IconButton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

function TableComponent(props) {
return (

  <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {props.columnTitles.map((title, idx) => {
            return (
              <TableCell
                key={title}
                align={idx !== 0 ? "center" : "left"}
                sx={{
                  background: "#2B2E41",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {title}
              </TableCell>
            );
          })}
          <TableCell
            sx={{
              background: "#2B2E41",
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Total Products: {props.products.length}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ "& tr:nth-of-type(2n)": { background: "#E3EBF8" } }}>
        {props.products.map((productInfo) => {
          return (
            <TableRow key={productInfo.productId}>
              <TableCell>{productInfo.productId}</TableCell>
              <TableCell>{productInfo.productName}</TableCell>
              <TableCell>{productInfo.productOwnerName}</TableCell>
              <TableCell>{productInfo.scrumMasterName}</TableCell>
              <TableCell>
                {productInfo.Developers.slice(0, 5).map((name, idx) => {
                  return (
                    <p style={{padding: 0, margin: 0}}key={name}>
                      {idx !== productInfo.Developers.slice(0, 5).length - 1
                        ? name + ", "
                        : name}
                    </p>
                  );
                })}
              </TableCell>
              <TableCell>{productInfo.startDate}</TableCell>
              <TableCell>{productInfo.methodology}</TableCell>
              <TableCell align='center'>
                <IconButton onClick={() => props.editEntry(productInfo)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
)
}

export default TableComponent;
