import { AuthRequest } from "../middleware/auth.js";
import { Response } from "express";
import prisma from "../utils/prisma.js";


export const getItem = async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      items
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    })
  }
}
export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, quantity, category } = req.body;

    const items = await prisma.item.create({
      data: {
        name,
        quantity: quantity || 1,
        category,
        userId: req.userId!
      }
    });
    res.status(201).json({
      success: true,
      items
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    })
  }
}
export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, quantity, category, purchased } = req.body;

    const items = await prisma.item.updateMany({
      where: {
        id,
        userId: req.userId
      },
      data: { name, quantity, category, purchased }
    });

    if (items.count === 0) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    const updatedItem = await prisma.item.findUnique({
      where: { id }
    });
    res.json({
      success: true,
      items: updatedItem
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    })
  }
}
export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const items = await prisma.item.deleteMany({
      where: { id, userId: req.userId }
    });

    if (items.count === 0) {
      res.status(404).json({
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
}