import { TodosAccess } from '../helpers/todosAcess'
// import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAcess = new TodosAccess()

export async function getTodosForUser(userId){
  return todosAcess.getTodosForUser(userId)
}

export async function deleteTodo(todoId,userId){
  return todosAcess.deleteTodo(todoId,userId)
}
export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId:string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  return await todosAcess.createTodo({
    userId,
    todoId,
    name: CreateTodoRequest.name,
    dueDate:CreateTodoRequest.dueDate,
    done: CreateTodoRequest.done,
    createdAt: CreateTodoRequest.createdAt,
    attachmentUrl: CreateTodoRequest.attachmentUrl,
  })
}

export async function updateTodo(
  UpdateTodoRequest: UpdateTodoRequest,
  todoId:string,
  userId:string
): Promise<UpdateTodoRequest> {


  return await todosAcess.updateTodo({
    name: UpdateTodoRequest.name,
    dueDate:UpdateTodoRequest.dueDate,
    done: UpdateTodoRequest.done,
  },todoId,userId)
}