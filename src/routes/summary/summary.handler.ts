import { Request, Response } from 'express'
import { generateSummary } from '../../services/summary-service/summary.service'

export async function summary(req: Request, res: Response) {
  try {
    const reqData = {
      userId: req.query.userId as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    }

    if (!reqData.userId || !reqData.dateFrom || !reqData.dateTo) {
      return res.status(400).json({ message: 'Missing required parameters' })
    }

    // confirm date matches YYYY-MM-DD
    const dateFrom = new Date(reqData.dateFrom)
    const dateTo = new Date(reqData.dateTo)
    if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' })
    }
    dateTo.setHours(23, 59, 59, 999)

    const response = await generateSummary(reqData.userId, dateFrom.toISOString(), dateTo.toISOString())
    if (!response) return res.status(500).json({ message: 'Error fetching summary' })
    return res.json(response)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching summary', error })
  }
}
