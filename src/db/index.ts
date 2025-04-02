/**
 * @description
 * This file initialises and exports a singleton instance of the PrismaClient,
 * which is used to interact with the database throughout the application.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
