from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

items = [{"text": "apple", "is_done": True}, {"text": "banana", "is_done": False}]
class Item(BaseModel):
  text: str
  is_done: bool = False


router = APIRouter( 
  prefix="/items",
  tags=["items"],
  responses={404: {"description": "Not found"}})

@router.post("/")
async def create_item(item: Item):
  items.append(dict(item))
  return items

@router.get("/{item_id}", response_model=Item)
async def read_item(item_id: int):
  if item_id >= len(items):
    raise HTTPException(status_code=404, detail=f"Item {item_id} not found") 
  else:
    return items[item_id]

@router.get("/")
async def read_items():
  return items

@router.put("/{item_id}")
async def update_item(item_id: int, item: Item):
  if item_id >= len(items):
    raise HTTPException(status_code=404, detail=f"Item {item_id} not found") 
  else:
    items[item_id] = item.model_dump()
    return items