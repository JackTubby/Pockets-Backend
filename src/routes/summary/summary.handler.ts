import { Request, Response } from 'express'
import { generateSummary } from '../../services/summary-service/summary.service'

export async function summary(req: Request, res: Response) {
  try {
    const reqData = {
      userId: req.params.userId,
      date: req.params.date,
    }
    const response = await generateSummary(reqData.userId, reqData.date)
    if (!response) return res.status(500).json({ message: 'Error fetching summary' })
    return res.json(response)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching summary', error })
  }
}
