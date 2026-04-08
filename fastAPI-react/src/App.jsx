import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import API from "./utils/axios";

function App() {
	const [items, setItems] = useState();
	const [item, setItem] = useState();
	const [addItem, setAddItem] = useState("");
	const [checked, setChecked] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [itemDialogOpen, setItemDialogOpen] = useState(false);

	useEffect(() => {
		try {
			async function getItems() {
				const response = await API.get("/items");
				setItems(response.data);
			}
			getItems();
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleClick = async (id) => {
		setDialogOpen(true);
		try {
				const response = await API.get(`/items/${id}`);
				setItem(response.data);
		} catch (error) {
			alert(error);
		}
	};

	function handleClose(item) {
		if (item) {
			setItemDialogOpen(false);
		} else {
			setDialogOpen(false);
		}
		setItem();
	}

	function handleDelete() {
		try {
			async function deleteItem(id) {
				await API.delete(`/items/${id}`);
			}
			deleteItem(item.id);
		} catch (error) {
			alert(error);
		}
		handleClose();
	}

	async function handleSubmit(type) {
		try {
			if (type === "add") {
				const response = await API.post(
					"/items",
					{
						text: addItem,
						is_done: checked,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				console.log(response.data);
			} else if (Number.isInteger(parseInt(type, 10))) {
				const response = await API.put(
					`/items/${type}`,
					{
						text: addItem,
						is_done: checked,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				console.log(response.data);
			}
		} catch (error) {
			alert(error);
		} finally {
			handleClose("add");
			setAddItem("");
			setChecked(false);
			const response = await API.get("/items");
			setItems(response.data);
		}
	}

	function handleNameChange(e) {
		setAddItem(e.target.value);
	}

	return (
		<div className="p-10 h-screen w-full flex flex-col items-center gap-20">
			<button
				type="button"
				className="p-2 bg-slate-400 rounded w-50 center"
				onClick={() => setItemDialogOpen(true)}
			>
				Add Item
			</button>
			{!items ? (
				<h1>Getting items...</h1>
			) : items.length === 0 ? (
				<h1>No items</h1>
			) : (
				<div className="items-div flex flex-row flex-wrap gap-5 w-full justify-center items-center">
					{items.map((item) => (
						<button
							type="button"
							key={item.id}
							onClick={() => handleClick(item.id)}
							className="p-2 bg-slate-400 rounded"
						>
							{item.name} {item.id}
						</button>
					))}
				</div>
			)}
			<Dialog
				open={dialogOpen}
				onClose={() => handleClose()}
				className="w-200 h-200 mx-auto"
			>
				{!item ? (
					<DialogTitle>Loading...</DialogTitle>
				) : (
					<>
						<input
							type="text"
							value={item.name}
							className="p-1 bg-slate-400 rounded"
							onChange={(e) => handleNameChange(e)}
						/>
						<DialogContent>
							<p>
								Completed: <> </>
								<input
									type="checkbox"
									id="done"
									checked={checked}
									className="p-1 bg-slate-400 rounded"
									onChange={() => setChecked(!checked)}
								/>
							</p>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => handleDelete(item.id)}>Delete</Button>
							<Button onClick={() => handleSubmit(item.id)}>Edit</Button>
							<Button onClick={() => handleClose()}>Back</Button>
						</DialogActions>
						{/* TODO: add update item */}
					</>
				)}
			</Dialog>
			<Dialog open={itemDialogOpen} onClose={() => handleClose("add")}>
				<DialogTitle>Add Item</DialogTitle>
				<DialogContent>
					<label htmlFor="item">
						Item name:<> </>
						<input
							type="text"
							name="item"
							value={addItem}
							placeholder="Enter item here"
							className="p-1 bg-slate-400 rounded"
							onChange={(e) => handleNameChange(e)}
						/>
					</label>
					<br />
					<label htmlFor="done">
						Completed:<> </>
						<input
							type="checkbox"
							name="done"
							id="done"
							checked={checked}
							className="p-1 bg-slate-400 rounded"
							onChange={() => setChecked(!checked)}
						/>
					</label>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose("add")}>Cancel</Button>
					<Button onClick={() => handleSubmit("add")}>Submit</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default App;
