import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function createImage(todoId: string, userId: string) {
  const item = {
    todoId,
    userId,
    attachmentUrl: `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
  }

  await docClient
    .update({
      TableName: this.todosTable,
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: item,
      Key: {
        todoId,
        userId
      }
    })
    .promise()

  return item
}

export async function todoIdExist(todoId: string) {
  const result = await docClient
    .get({
      TableName: process.env.TODOS_TABLE,
      Key: {
        todoId
      }
    })
    .promise()

  return !!result.Item
}

export function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: todoId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  })
}
