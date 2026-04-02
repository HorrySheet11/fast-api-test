from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from prisma import Prisma
from prisma.models import Items

db = Prisma()

class Item(BaseModel):
  text: str
  is_done: bool = False


router = APIRouter( 
  prefix="/items",
  tags=["items"],
  responses={404: {"description": "Not found"}})

@router.post("/")
async def create_item(item: Item):
  await db.connect()
  data = await db.items.create(
    data={
      "name": item.text,
      "isDone": item.is_done
    }
  )
  await db.disconnect()
  return data

@router.get("/{item_id}")
async def read_item(item_id : int):
  await db.connect()
  length = await db.items.count()
  if item_id < 0 or item_id > length:
    raise HTTPException(status_code=404, detail="Item not found")
  item = await db.items.find_unique(
    where={"id": item_id}
    )
  await db.disconnect()
  return item

@router.get("/")
async def read_items():
  await db.connect()
  items = await db.items.find_many()
  await db.disconnect()
  return items

@router.put("/{item_id}")
async def update_item(item_id: int, item: Item):
  await db.connect()
  res = await db.items.update(
    where={"id": item_id},
    data={
      "name": item.text,
      "isDone": item.is_done
    }
  )
  await db.disconnect()
  return res