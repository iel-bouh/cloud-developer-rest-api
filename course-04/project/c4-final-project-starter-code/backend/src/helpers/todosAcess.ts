import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexTable = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getTodosForUser(userId) {
    logger.info('getting all todos', userId)

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.indexTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const item = result.Items
    return item
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    logger.info('create todo', item)

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: item
      })
      .promise()

    return item
  }

  async updateTodo(
    item: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    logger.info('update todo todo', todoId)

    await this.docClient
      .update({
        TableName: this.todosTable,
        UpdateExpression: 'set name = :name ,dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: item,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    return item
  }
  async deleteTodo(todoId, userId) {
    logger.info('delete todo', todoId)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: {
            S: userId
          },
          todoId: {
            S: todoId
          }
        }
      })
      .promise()

    return todoId
  }
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
