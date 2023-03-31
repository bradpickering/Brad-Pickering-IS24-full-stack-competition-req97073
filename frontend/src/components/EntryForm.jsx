import { Modal, Button } from "@mui/material";

function EntryForm(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    for (let inputField in props.entry) {
      if (props.entry[inputField] === "" && inputField !== 'productId') {
        alert("Please fill all fields.");
        return;
      }
    }
    // Call the function to make the API call if all the fields are filled
    props.submitEntry();
  };

  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
      }}
      className="form-modal"
      open={props.openEntry}
      onClose={() => props.closeEntryForm()}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            width: "500px",
            borderRadius: "12px",
            background: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: 30 }}>
            {props.entryType === 'add' ? 'Add New Entry': 'Edit Existing Entry'}
          </h3>
          {Object.keys(props.entry).map((inputField, idx) => {
            return (
              idx !== 0 && <div
                key={inputField}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginBottom: 30,
                  width: "100%",
                }}
              >
                <h4
                  style={{
                    width: "120px",
                    padding: 0,
                    margin: 0,
                    marginTop: 10,
                  }}
                >
                  {inputField}
                </h4>
                <input
                  type="text"
                  style={{ height: 30, width: 200 }}
                  value={props.entry[inputField]}
                  onChange={(e) =>
                    props.handleEntryChange(inputField, e.target.value)
                  }
                ></input>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginBottom: 30,
              }}
            >
              <Button onClick={(e) => props.closeEntryForm(e)} color="error">
                Cancel
              </Button>
              <Button type="submit" color="success">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EntryForm;
