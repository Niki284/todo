/**
 * API-Todo Controller
 */

import { getConnection } from 'typeorm';

export const postTodo = async (req, res, next) => {
  try {
    // validate incoming body
    if (!req.body.name) throw new Error('Please provide a name for an todo.');

    // get the repository from
    const todoReposity = getConnection().getRepository('TodoItem');

    // get todo (if this one exists)
    const todo = await todoReposity.findOne({
      where: { name: req.body.name },
    });
    // if ineterest already exists
    if (todo) {
      res.status(200).json({ status: `Posted Todo with id${todo.id}` });
      return;
    }

    // save the todo in the repository
    const insertedTodo = await todoReposity.save(req.body);

    res.status(200).json({ status: `posted todo with id:${insertedTodo.id}` });

    res.status(200).json({ status: 'Posted todo.' });
  } catch (error) {
    next(error.message);
  }
};
export const getTodos = async (req, res, next) => {
  try {
    // get the todo repository
    const todoReposity = getConnection().getRepository('TodoItem');

    // send back to client
    res.status(200).json(await todoReposity.find());
  } catch (error) {
    next(error.message);
  }
};
export const deleteTodo = async (req, res, next) => {
  console.log(req.body);
  try {
    const { id } = req.body;

    if (!id) throw new Error('del');

    const todoReposity = getConnection().getRepository('TodoItem');

    const todo = await todoReposity.findOne({ id });

    if (!todo) throw new Error(`del de todo op id : ${id}`);
    await todoReposity.remove({ id });

    res.status(200).json({ status: `delete todo. ${id}` });
  } catch (error) {
    next(error.message);
  }
};
export const updateTodo = async (req, res, next) => {
  try {
    if (!req.body.id) throw new Error('nnjhiu');

    const todoReposity = getConnection().getRepository('TodoItem');

    const todo = await todoReposity.findOne({
      where: { id: req.body.id },
    });
    if (!todo) throw new Error('give');
    const updateTodo = { ...todo, ...req.body };

    // save
    await todoReposity.save(updateTodo);

    res.status(200).json({ status: `update Todo. ${req.body.id}` });
  } catch (error) {
    next(error.message);
  }
};
