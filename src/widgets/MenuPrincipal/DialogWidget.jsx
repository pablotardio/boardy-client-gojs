import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
/**
 *
 * @param {*} formState should contain a form and a setForm function that uses the state
 */
export default function DialogWidget({
	
	handleSubmit,
	open,
	title,
	description,
	handleClose,
	content
}) {
	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{description}</DialogContentText>
				
					{content}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Continuar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
