import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import API from "./utils/axios";

function App() {
	const [items, setItems] = useState([]);
	const [item, setItem] = useState();
	const [dialogOpen, setDialogOpen] = useState(false);

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

	const handleClick = (id) => {
		setDialogOpen(true);
		try {
			async function getItem(id) {
				const response = await API.get(`/items/${id}`);
				setItem(response.data);
			}
			getItem(id);
		} catch (error) {
			alert(error);
		}
	};

	useEffect(() => {
		console.log(item);
	}, [item]);

	useEffect(() => {
		console.log(items);
	}, [items]);

	function handleClose() {
		setDialogOpen(false);
		setItem();
	}

	return (
		<div className="p-10 h-screen w-full flex flex-col items-center gap-20">
			<button type="button" className="p-2 bg-slate-400 rounded w-50 center">
				Add Item
			</button>
			{!items || items.length === 0 ? (
				<h1>Getting items...</h1>
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
			{/* TODO: continue dialog */}
			<Dialog
				open={dialogOpen}
				onClose={() => handleClose()}
				className="w-200 h-200 mx-auto"
			>
				{
					!item  ? (
						<DialogTitle>Loading...</DialogTitle>
					) : (
						<>
							<DialogTitle>{item.name}</DialogTitle>
							<DialogContent>
								<p>Completed: {item.isDone ? "True" : "False"}</p>
							</DialogContent>
						</>
					)
					/* <DialogActions>
					<Button>Cancel</Button>
					<Button>Ok</Button>
				</DialogActions> */
				}
			</Dialog>
		</div>
	);
}

export default App;
