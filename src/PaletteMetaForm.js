import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

class PaletteMetaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: "form",
      newPaletteName: "",
    };
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("isPaletteNameUnique", (value) =>
      this.props.palettes.every(
        ({ paletteName }) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    );
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  showEmojiPicker = () => {
    this.setState({ stage: "emoji" });
  };

  savePalette = (emoji) => {
    this.props.handleSubmit({
      paletteName: this.state.newPaletteName,
      emoji: emoji.native,
    });
    this.setState({ stage: "" });
  };

  render() {
    const { stage, newPaletteName } = this.state;
    const { handleSubmit, hideForm } = this.props;

    return (
      <div>
        <Dialog open={stage === "emoji"}>
          <DialogTitle id="form-dialog-title">
            Enter Palette Emojis{" "}
          </DialogTitle>
          <Picker onSelect={this.savePalette} title="Pick a Palette Emojis" />
        </Dialog>
        <Dialog
          open={stage === "form"}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          onClose={hideForm}
        >
          <DialogTitle id="form-dialog-title">Enter Palette Name </DialogTitle>
          <ValidatorForm onSubmit={this.showEmojiPicker}>
            <DialogContent>
              <DialogContentText>
                Please Enter your name for palette make sure its unique
              </DialogContentText>

              <TextValidator
                value={newPaletteName}
                label="Palette Name"
                name="newPaletteName"
                fullWidth
                margin="normal"
                onChange={this.handleChange}
                validators={["required", "isPaletteNameUnique"]}
                errorMessages={["Enter palette name", "Name already taken"]}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={hideForm} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Palette
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}

export default PaletteMetaForm;
