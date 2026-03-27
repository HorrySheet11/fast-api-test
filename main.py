from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
  text: str = None
  is_done: bool = False

items = []

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
  if item_id >= len(items):
    raise HTTPException(status_code=404, detail=f"Item {item_id} not found") 
  else:
    return items[item_id]

@app.post("/items")
async def create_item(item: Item):
  items.append(item)
  return items

@app.get("/items")
async def read_items():
  return items

@app.get("/items/", response_model=Item)
async def list_items(limit: int = 10):
  return items[0:limit]