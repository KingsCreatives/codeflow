"use server"

import {isDatabaseConnected} from "../db/dbcheck"

export async function createQuestion(params:any) {
    
    try {
        isDatabaseConnected()
    } catch (error) {
        
    }
}