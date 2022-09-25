import { TodosAccess } from '../dataLayer/todosAcess'
import * as AttachmentUtils from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todosAcess = new TodosAccess()

export async function getTodosForUser(userId) {
  return await todosAcess.getTodosForUser(userId)
}

export async function deleteTodo(todoId, userId) {
  return todosAcess.deleteTodo(todoId, userId)
}
export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await todosAcess.createTodo({
    userId,
    todoId,
    createdAt: new Date().toLocaleString(),
    ...CreateTodoRequest
  })
}

export async function updateTodo(
  UpdateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<UpdateTodoRequest> {
  return await todosAcess.updateTodo(UpdateTodoRequest, todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId, userId) {
  const validTodoId = await AttachmentUtils.todoIdExist(todoId, userId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'todo does not exist'
      })
    }
  }

  await AttachmentUtils.createImage(todoId, userId)

  const url = AttachmentUtils.getUploadUrl(todoId)

  return url
}
