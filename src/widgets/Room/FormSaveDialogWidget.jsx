import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import handleChangeProvider from "../../providers/handleChange.provider";
/**
 *
 * @param {*} formState should contain a form and a setForm function that uses the state
 */
export default function v({
	 form,
   setForm,
	handleSubmit,
	open,
	title,
	description,
	handleClose,
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
					<TextField
						autoFocus
						margin="dense"
						id="nombre"
						name="nombre"
						label="nombre"
						type="text"
						value={form.nombre}
						onChange={(e) =>
							handleChangeProvider(e, form, setForm)
						}
						fullWidth
					/>
					<TextField
						margin="dense"
						id="codigo"
						name="descripcion"
						label="descripcion"
						type="text"
						value={form.descripcion}
						onChange={(e) =>
							handleChangeProvider(e,form, setForm)
						}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Subscribe
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
