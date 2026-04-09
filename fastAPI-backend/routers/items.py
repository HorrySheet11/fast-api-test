from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from prisma import Prisma

db = Prisma()
class Item(BaseModel):
  text: str
  is_done: bool = False


router = APIRouter( 
  prefix="/items",
  tags=["items"],
  responses={404: {"description": "Not found"}})


async def is_db_connected() -> bool:
    try:
        await db.execute_raw('SELECT 1')
        return True
    except Exception:
        return False

@router.get("/")
async def read_items():
  if await is_db_connected() == False:
      await db.connect()
  print("read_items")
  items = await db.items.find_many()
  await db.disconnect()
  return items

@router.post("/")
async def create_item(item: Item):
  if await is_db_connected() == False:
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
  if await is_db_connected() == False:
      await db.connect()
  length = await db.items.count()
  if item_id < 0 or item_id > length:
    raise HTTPException(status_code=404, detail="Item not found")
  item = await db.items.find_unique(
    where={"id": item_id}
    )
  await db.disconnect()
  return item

@router.put("/{item_id}")
async def update_item(item_id: int, item: Item):
  if await is_db_connected() == False:
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

@router.delete("/{item_id}")
async def delete_item(item_id: int):
  if await is_db_connected() == False:
      await db.connect()
  res = await db.items.delete(
    where={"id": item_id}
  )
  await db.disconnect()
  return res