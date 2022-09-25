import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
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
      TableName: process.env.TODOS_TABLE,
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': item['attachmentUrl']
      },
      Key: {
        todoId,
        userId
      }
    })
    .promise()

  return item
}

export async function todoIdExist(todoId: string, userId: string) {
  const result = await docClient
    .get({
      TableName: process.env.TODOS_TABLE,
      Key: {
        todoId,
        userId
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
