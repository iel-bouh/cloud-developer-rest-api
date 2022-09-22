import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodosForUser(userId){
    console.log('Getting all Items')

    const result = await this.docClient.scan({
      TableName: this.todosTable,
      id: userId
    }).promise()

    const items = result.Items
    return items
  }

//   async createGroup(group: Group): Promise<Group> {
//     await this.docClient.put({
//       TableName: this.groupsTable,
//       Item: group
//     }).promise()

//     return group
//   }
// }

// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
}
