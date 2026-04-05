import { useEffect, useState } from "react";
import API from "./utils/axios";

function App() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		try {
			async function getItems() {
				const response = await API.get("/items"
				);
				setItems(response.data);
			}
      getItems();
		} catch (error) {
			console.log(error);
		}
	},[]);

	return (
		<>
			{!items || items.length === 0 ? (
				<h1>Getting items...</h1>
			) : (
				<div id="items-div">
					{items.map((item) => (
						<div key={item.id}>{item.name}</div>
					))}
				</div>
			)}
			<button type="button">Add Item</button>
		</>
	);
}

export default App;
