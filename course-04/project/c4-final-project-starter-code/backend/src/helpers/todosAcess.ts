import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

// const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}),
    private readonly todosTable = process.env.TODOS_TABLE
    
    ) {
  }

  async getTodosForUser(userId){
    console.log('Getting all Items')

    const result = await this.docClient.get({
      

      TableName: this.todosTable,
      Key: {
        'userId': userId
      }
    }).promise()

    const item = result.Item
    return item
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: item
    }).promise()

    return item
  }


  async updateTodo(item: TodoUpdate,todoId:string,userId:string): Promise<TodoUpdate> {
    await this.docClient.update({
      TableName: this.todosTable,
      UpdateExpression:"set name = :name ,dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: item,
      Key: {
        todoId,
        userId,
      },

    }).promise()

    return item
  }
}
// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
// }
